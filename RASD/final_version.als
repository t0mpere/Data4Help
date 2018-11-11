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

sig Username{}

--
one sig Notification{
	notifications: BusinessCustomer set -> Time
}

abstract sig Customer{
	username: one Username
}

sig PrivateCustomer extends Customer{
	automatedSOS: one Bool,
	emergencyCall: one Bool,
	status: one HealthStatus,
	personalData: one UserData, --realtime data 
	recordData: set UserData,     --past data
	requests:  IndividualRequest set -> Time
}{
	--the dimension of the requests can only increasing
	all t1:Time | no t2:Time | t2 in t1.nexts and #requests.t2 < #requests.t1

	--personalData is always the most recent data
	max[recordData.timeStamp] < personalData.timeStamp
}

sig BusinessCustomer extends Customer{
	anonRequests: AnonymizedRequest set -> Time,
}

abstract sig Request{
	subscription: one Bool,
	newDataAvailable: Bool one -> Time,
	bc: one BusinessCustomer
}

sig IndividualRequest extends Request{
	status: RequestStatus one -> Time
}{
	--At the beginning each individual request is denied, because it has not been accepted yet
	one t:Time | t = min[Time] and status.t = DeniedStatus
}

sig AnonymizedRequest extends Request{
	numberOfPeople: some PrivateCustomer
}{
	#numberOfPeople > 5
}

one sig AutomatedSOS{
	subscribed: set PrivateCustomer,
	emergencyCall: set PrivateCustomer -> Bool
}

fact customerRules{
	--All usernames must be different
	no disj c1,c2: Customer | c1.username = c2.username

	--All userData belongs to only one customer
	all disj pc1,pc2: PrivateCustomer | no data: UserData |
		(data in pc1.recordData and data in pc2.recordData) or
		(data in pc1.personalData and data in pc2.recordData) or
		(data in pc1.personalData and data in pc2.personalData) or
		(data in pc1.recordData and data in pc2.personalData)
	
	--For each userData exist one PrivateCustomer in which userData is contained
	all data: UserData | one pc: PrivateCustomer | data in pc.recordData or data in pc.personalData
}

fact requestRules{
	-- No individual request linked to two different private customers should exist
	all disj pc1,pc2: PrivateCustomer, t:Time | no r: IndividualRequest | r in pc1.requests.t and r in pc2.requests.t

	--All accepted request must be linked with a private customer
	all i:IndividualRequest , t: Time | i.status.t = AcceptedStatus iff one pc: PrivateCustomer | i in pc.requests.t

	--All requests belong to the same privateCustomer, at all the following times
	all r: IndividualRequest, t: Time | all pc: PrivateCustomer | r in pc.requests.t implies 
								(all t2: Time | t2 in t.nexts implies (r in pc.requests.t2))

	--All anonymized requests belong to the same BusinessCustomer
	all a: AnonymizedRequest, t: Time | all bc: BusinessCustomer | a in bc.anonRequests.t implies 
							(all t2: Time | t2 in t.nexts implies (a in bc.anonRequests.t2))
}

fact emergencySituation{
	all pc: PrivateCustomer | pc.status = SeriousConditions iff 
						(pc.personalData.heartRate > 130 or pc.personalData.heartRate < 50 
						or pc.personalData.bloodPressure > 130 or pc.personalData.bloodPressure < 60)
}

fact noEmergencyCallForUnsubscribed{
	--AutomatedSOS service is valid only for those subscribed Private Customer
	all pc: PrivateCustomer | pc in AutomatedSOS.subscribed iff pc.automatedSOS = True
}

fact emergencyCall{
	--Emergency call is done only if a subscribed PC is in serious conditions
	all pc: PrivateCustomer | pc.emergencyCall = True iff 
						(pc in AutomatedSOS.subscribed and pc.status = SeriousConditions)
}

fact notificationOfUpdate{
	--There may be new anonymized data only if a subscription has been requested
	all r: AnonymizedRequest, t: Time | r.newDataAvailable.t = True implies r.subscription = True

	--There may be new individual data only if a subscription has been requested and the request has been accepted
	all r: IndividualRequest, t: Time | r.newDataAvailable.t = True implies (r.subscription = True and r.status.t = AcceptedStatus)

	--If there is new available data a notification must be sent
	all r: Request, t: Time | no bc1: BusinessCustomer | bc1 = r.bc 
			and r.newDataAvailable.t = True and bc1 not in Notification.notifications.t

	--Only the BCs who have requests with new available data can be notified
	all t: Time | no bc1: BusinessCustomer | 
			bc1 in Notification.notifications.t and no r: Request | bc1 = r.bc and r.newDataAvailable.t = True
}

pred makeIndividualRequest[i: IndividualRequest, t1, t2: Time, pc, pc': PrivateCustomer]{
	// precondition
	not i in pc.requests.t1 
	// postconditions
	t2 = t1.next
	pc'.requests = pc.requests + i -> t2
}

pred makeAnonymizedRequest[a: AnonymizedRequest, t1, t2: Time, bc, bc': BusinessCustomer]{
	//precondition
	not a in bc.anonRequests.t1

	//postconditions
	t2 = t1.next
	bc'.anonRequests = bc.anonRequests + a -> t2
}

pred acceptIndividualRequest[i : IndividualRequest, t1, t2: Time,pc:PrivateCustomer]{
	//precondition
	i in pc.requests.t1

	//postconditions
	i.status.t1 = DeniedStatus implies i.status.t2 = AcceptedStatus
	t2 = t1.next
}

run makeAnonymizedRequest for 8 but 8 Int, exactly 1 AnonymizedRequest, exactly 6 IndividualRequest, exactly 8 UserData
run makeIndividualRequest for 10 but 8 Int, exactly 1 IndividualRequest, exactly 6 UserData, exactly 6 PrivateCustomer
run acceptIndividualRequest for 10 but 8 Int, exactly 5 IndividualRequest
