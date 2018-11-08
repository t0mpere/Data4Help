open util/integer
open util/boolean
open util/time
open util/ordering [Time]

abstract sig HealthStatus{}
one sig HealthyConditions extends HealthStatus{}
one sig SeriousConditions extends HealthStatus{}

sig UserData{
	heartRate: one Int,
	bloodPressure: one Int,
	timeStamp: one Time,
	location: one String
}

abstract sig Customer{
	username: one String
}

sig PrivateCustomer extends Customer{
	automatedSOS: one Bool,
	personalData: one UserData, --realtime
	recordData: set UserData,     --storico
	requests:  IndividualRequest set -> Time
}{
	--la dimensione delle richieste può solo aumentare
	all t1:Time | no t2:Time | t2 in t1.nexts and #requests.t2 < #requests.t1
}

sig BusinessCustomer extends Customer{}


abstract sig Requests {
	bc: one BusinessCustomer,
}

sig IndividualRequest extends Requests{}

fact requestRules{
	--tutti gli username devono essere diversi
	no disj  pc1,pc2: PrivateCustomer | pc1.username = pc2.username
	no disj  bc1,bc2: BusinessCustomer | bc1.username = bc2.username
	all pc: PrivateCustomer | no bc: BusinessCustomer | pc.username = bc.username
	all bc: BusinessCustomer | no pc: PrivateCustomer | bc.username = pc.username
	
	--non ci può essere la stessa richiesta allo stesso tempo in due privateCustomer
	all disj pc1,pc2: PrivateCustomer, t:Time | no r: IndividualRequest | r in pc1.requests.t and r in pc2.requests.t 

	--tutte le richieste appartengono allo stesso privateCustomer, in tutti gli istanti successivi
	all r: IndividualRequest, t: Time | all pc: PrivateCustomer | r in pc.requests.t implies (all t2: Time |
	t2 in t.nexts implies (r in pc.requests.t2))
}

pred makeIndividualRequest[i: IndividualRequest, t1, t2: Time, pc, pc': PrivateCustomer]{
	// preconditions
	not i in pc.requests.t1 

	// postconditions
	t2 = t1.next
	pc'.requests = pc.requests + i -> t2
}

run makeIndividualRequest for 10 but 8 Int, exactly 5 String
