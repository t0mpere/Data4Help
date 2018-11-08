open util/integer
open util/boolean
open util/time

--instances of time
/**
sig Time{
	time: some Int
}**/

sig Customer{
	username: one String
}
sig PrivateCustomer {
	requests: set IndividualRequest -> Time
}{
	--la dimensione delle richieste può solo aumentare
	--all t1:Time | no t2:Time | t2 = t1.next and #requests.t2 < #requests.t1
	--all t: Time | gte[#requests.(t.next),#requests.t]
	--all i: IndividualRequest, t: Time | i in requests.t implies i in requests.(t.next)
}

sig BusinessCustomer {}


abstract sig Requests {
	bc: one BusinessCustomer,
	id: one Int
}

sig IndividualRequest extends Requests{}

fact requestRules{
	--tutti gli id devono essere diversi
	all disj r1,r2: Requests | r1.id != r2.id
	--non ci può essere la stessa richiesta allo stesso tempo in due privateCustomer
	all disj pc1,pc2: PrivateCustomer, t:Time | no r: IndividualRequest | r in pc1.requests.t and r in pc2.requests.t 
	--le richieste non possono cambiare Private Customer successivamente
	--all disj pc1,pc2: PrivateCustomer| no r: IndividualRequest | r in pc1.requests.Time and r in pc2.requests.(Time.next)
	--le richieste devono rimanere allo stesso pc
	--all t: Time, pc: PrivateCustomer | some r: IndividualRequest | (r in pc.requests.t) implies (r in pc.requests.(t.next))
	--all t: Time, r: IndividualRequest | lone pc1: PrivateCustomer | r in pc1.requests.t and no pc2: PrivateCustomer | pc1 != pc2 and r in pc2.requests.(t.next)
}
/**
fact timeRules{
	no t: Time | t < 0
	no disj t1,t2:Time | t1.time = t2.time
}**/


pred makeIndividualRequest[i: IndividualRequest,t: Time, pc: PrivateCustomer]{
	// preconditions
	not i in pc.requests.t 
	// postconditions
	i in pc.requests.(t.next)
	#pc.requests.(t.next) = #pc.requests.t + 1
} 
run makeIndividualRequest for 10 but 8 Int, exactly 2 PrivateCustomer
