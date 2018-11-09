open util/integer
open util/boolean
open util/time
open util/ordering [Time]

abstract sig HealthStatus{}
one sig HealthyConditions extends HealthStatus{}
one sig SeriousConditions extends HealthStatus{}

abstract sig RequestStatus{}
one sig AcceptedStatus extends RequestStatus{}
one sig DeniedStatus extends RequestStatus{}

sig Location{}

sig UserData{
	heartRate: one Int,
	bloodPressure: one Int,
	timeStamp: one Int,
	location: one Location
}

one sig UserBase{
	pcs: PrivateCustomer set -> Time,
	bcs: BusinessCustomer set -> Time
}

sig Username{}

abstract sig Customer{
	username: one Username
}

sig PrivateCustomer extends Customer{
	automatedSOS: one Bool,
	status: one HealthStatus,
	personalData: one UserData, --realtime
	recordData: set UserData,     --storico
	requests:  IndividualRequest set -> Time
}{
	--la dimensione delle richieste può solo aumentare
	all t1:Time | no t2:Time | t2 in t1.nexts and #requests.t2 < #requests.t1
	max[recordData.timeStamp] < personalData.timeStamp

	personalData.heartRate < 100 and personalData.heartRate > 60 and personalData.bloodPressure < 120 
	and personalData.bloodPressure > 80 implies status = HealthyConditions else status = SeriousConditions
}

sig BusinessCustomer extends Customer{
	anonRequests: AnonymizedRequest set -> Time,
}


abstract sig Request{
	bc: one BusinessCustomer,
}

sig IndividualRequest extends Request{
	status: RequestStatus one -> Time
}{
	--Tutte le request sono denied all'inizio
	one t:Time | t = min[Time] and status.t = DeniedStatus
}

sig AnonymizedRequest extends Request{
	numberOfPeople: some PrivateCustomer,
}{
	#numberOfPeople > 5
}

one sig AutomatedSOS{
	subscribed: set PrivateCustomer,
	emergencyCall: PrivateCustomer one -> Bool
}

fact customerRules{
	--all usernames must be different
	no disj  pc1,pc2: PrivateCustomer | pc1.username = pc2.username
	no disj  bc1,bc2: BusinessCustomer | bc1.username = bc2.username
	all pc: PrivateCustomer | no bc: BusinessCustomer | pc.username = bc.username
	all bc: BusinessCustomer | no pc: PrivateCustomer | bc.username = pc.username

	--all userData belongs to only one customer
	all disj pc1,pc2: PrivateCustomer | no data: UserData |
		(data in pc1.recordData and data in pc2.recordData) or
		(data in pc1.personalData and data in pc2.recordData) or
		(data in pc1.personalData and data in pc2.personalData) or
		(data in pc1.recordData and data in pc2.personalData)
	
	--for each userData exist one PrivateCustomer in which userData is contained
	all data: UserData | one pc: PrivateCustomer | data in pc.recordData or data in pc.personalData
}

fact requestRules{
	-- No individual request should exist linked to two different private customers
	all disj pc1,pc2: PrivateCustomer, t:Time | no r: IndividualRequest | r in pc1.requests.t and r in pc2.requests.t 
	--All accepted request must be linked with a private customer
	all i:IndividualRequest , t: Time | i.status.t = AcceptedStatus iff one pc: PrivateCustomer | i in pc.requests.t
	--tutte le richieste appartengono allo stesso privateCustomer, in tutti gli istanti successivi
	all r: IndividualRequest, t: Time | all pc: PrivateCustomer | r in pc.requests.t implies (all t2: Time |
	t2 in t.nexts implies (r in pc.requests.t2))

	--tutte le richieste anonime appartengono al BusinessCustomer
	all a: AnonymizedRequest, t: Time | all bc: BusinessCustomer | a in bc.anonRequests.t implies (all t2: Time |
	t2 in t.nexts implies (a in bc.anonRequests.t2))
}

fact userBaseRules{
	all pc:PrivateCustomer, t:Time | #pc.requests.t > 0 iff pc in UserBase.pcs.t
	all i:IndividualRequest, t:Time | #i.bc > 0 iff i.bc in UserBase.bcs.t
}

/**fact userDataUpdate{
	all pc:PrivateCustomer, pd: UserData | pd in pc.personalData.t implies (not pd in pc.personalData.(t.next) and pd in pc.recordData.(t.next)) 
}**/

fact noEmergencyCallForUnsubscribed{
	--questo per dire che per il servizio può valere solo per quelli iscritti
	all pc: PrivateCustomer | pc in AutomatedSOS.subscribed iff pc.automatedSOS = True
}

fact emergencyCall{
	all pc: PrivateCustomer | AutomatedSOS.subscribed = pc and pc.status = SeriousConditions
	implies AutomatedSOS.emergencyCall[pc] = True
}

pred makeIndividualRequest[i: IndividualRequest, t1, t2: Time, pc, pc': PrivateCustomer]{
	// preconditions
	not i in pc.requests.t1 

	// postconditions
	t2 = t1.next
	pc'.requests = pc.requests + i -> t2
}

pred makeAnonymizedRequest[a: AnonymizedRequest, t1, t2: Time, bc, bc': BusinessCustomer]{
	//preconditions
	not a in bc.anonRequests.t1

	//postconditions
	t2 = t1.next
	bc'.anonRequests = bc.anonRequests + a -> t2
}

pred acceptIndividualRequest[i : IndividualRequest, t1, t2: Time,pc:PrivateCustomer]{
	//pre	
	i in pc.requests.(t1)
	//post
	i.status.t1 = DeniedStatus implies i.status.t2 = AcceptedStatus
	t2 = t1.next
}

pred addPrivateCustomer[u:UserBase, t1,t2:Time,pc:PrivateCustomer]{
	//pre
	not pc in u.pcs.t1
	//post
	t1.next = t2
	pc in u.pcs.t2
}

run makeAnonymizedRequest for 10 but 8 Int, exactly 1 AnonymizedRequest, exactly 1 IndividualRequest
run makeIndividualRequest for 10 but 8 Int, exactly 1 IndividualRequest, exactly 6 UserData, exactly 6 PrivateCustomer
run acceptIndividualRequest for 10 but 8 Int, exactly 5 String, exactly 5 IndividualRequest
run addPrivateCustomer for 10 but 8 Int, exactly 5 String, exactly 5 IndividualRequest
