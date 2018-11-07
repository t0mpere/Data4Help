open util/integer
open util/boolean

abstract sig HealthStatus{}
one sig HealthyConditions extends HealthStatus{}
one sig SeriousConditions extends HealthStatus{}

sig UserData{
	heartRate: one Int,
	bloodPressure: one Int,
	timeStamp: one Int,
	location: one String
}

sig Customer{
	username: one String
}

--si potrebbe aggiungere le richieste ricevute da parte dei business customer, anche accettate o rifiutate
one sig PrivateCustomer extends Customer{
	automatedSOS: one Bool,
	personalData: one UserData,
	status: one HealthStatus
}{
	--magari qua diciamo che assumiamo che un stato di salute buono deve essere compreso
	--tra questi parametri
	personalData.heartRate < 100 and personalData.heartRate > 60 and personalData.bloodPressure < 120 
	and personalData.bloodPressure > 80 implies status = HealthyConditions else status = SeriousConditions
}

one sig BusinessCustomer extends Customer{
	request: set Request
}

sig Request{
	subscription: one Bool,
	day: one Int
}	

one sig IndividualRequest extends Request{
	privateCustomer: one PrivateCustomer,
}

one sig AnonymizedRequest extends Request{
	numberOfPeople: one Int,
}{
	numberOfPeople > 1000
}

one sig AutomatedSOS{
	subscribed: set PrivateCustomer,
	emergencyCall: PrivateCustomer one -> Bool
}

fact usernameIsUnique{
	no disj  u1,u2: Customer | u1.username = u2.username
} 

fact noEmergencyCallForUnsubscribed{
	--questo per dire che per il servizio può valere solo per quelli iscritti
	no pc1: PrivateCustomer | all b: Bool | AutomatedSOS.emergencyCall.b = pc1 and no pc2: PrivateCustomer | AutomatedSOS.subscribed = pc2 and
	pc2.username = pc1.username
}

--Cazzate
pred makeAnonymRequest[b:BusinessCustomer,a:AnonymizedRequest]{
	b.request = a
	a.numberOfPeople = 1001
}

run makeAnonymRequest for 5 but 8 Int, exactly 5 String
