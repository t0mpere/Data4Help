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
	numberOfPeople: one Int
}{
	numberOfPeople > 1000
}
