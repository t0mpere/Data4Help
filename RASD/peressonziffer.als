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
	all t:Time | #(requests.t + 1) = #(requests.(t.next)) or #(requests.t) = #(requests.(t.next))
}

sig BusinessCustomer {
		
}


abstract sig Requests {
	bc: one BusinessCustomer,
	id: one Int
}
sig IndividualRequest extends Requests{}
fact requestRules{
	all disj r1,r2: Requests | r1.id != r2.id
	all disj pc1,pc2: PrivateCustomer | no r:IndividualRequest | all t:Time | r in pc1.requests.t and r in pc2.requests.t 
	--all disj pc1,pc2: PrivateCustomer, t:Time | 
	all r:IndividualRequest, t:Time | one pc:PrivateCustomer | r in pc.requests.t 
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
run makeIndividualRequest for 5
