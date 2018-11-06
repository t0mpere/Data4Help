open util/boolean

abstract sig Customer{
	username: one String
}

one sig PrivateCustomer extends Customer{
	automatedSOS: one Bool
}

one sig BusinessCustomer extends Customer{}

abstract sig Request{
	subscription: one Bool
}	

one sig IndividualRequest extends Request{
	privateCustomer: one PrivateCustomer,
	businessCustomer: one BusinessCustomer
}
one sig AnonymizedRequest extends Request{
	numberOfPeople: one Int,
	businessCustomer: one BusinessCustomer,
	day: one Int
}{
	numberOfPeople > 1000
}
fact usernameIsUnique{
	no disjoint  u1,u2: Customer | u1.username = u2.username
} 

--max 5 request per user per day
fact maxRequestConstraint{
	no disjoint r1,r2,r3,r4,r5: AnonymizedRequest |
		r1.businessCustomer = r2.businessCustomer and
		r1.businessCustomer = r3.businessCustomer and
		r1.businessCustomer = r4.businessCustomer and
		r1.businessCustomer = r5.businessCustomer and
		r1.day = r2.day and
		r1.day = r3.day and
		r1.day = r4.day and
		r1.day = r5.day
}
--Cazzate
pred makeAnonymRequest[b:BusinessCustomer,a:AnonymizedRequest]{
	a.businessCustomer = b
	a.numberOfPeople = 1001
}

run makeAnonymRequest for 5 but 8 int, exactly 5 String
