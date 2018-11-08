open util/integer
open util/boolean
open util/time

--aggiungere il tempo per aggiornare la subscription
-- dati accettati aggiunti ai dati da vedere
-- accetta/rifiuta una request come predicati

--aggiunta nuovo utente
--richiesta individuale e anonima
--subscription
--automatedSOS
/*
abstract sig HealthStatus{}
one sig HealthyConditions extends HealthStatus{}
one sig SeriousConditions extends HealthStatus{}*/

sig UserData{
	heartRate: one Int,
	bloodPressure: one Int,
	--timeStamp: one Time,
	location: one String
}

sig Customer{
	username: one String
}

--si potrebbe aggiungere le richieste ricevute da parte dei business customer, anche accettate o rifiutate
sig PrivateCustomer{
	automatedSOS: one Bool,
	personalData: one UserData, --realtime
	recordData: set UserData, --storico
	requests: set IndividualRequest,
	--status: one HealthStatus
}{
	--magari qua diciamo che assumiamo che un stato di salute buono deve essere compreso
	--tra questi parametri
	--personalData.heartRate < 100 and personalData.heartRate > 60 and personalData.bloodPressure < 120 
	--and personalData.bloodPressure > 80 implies status = HealthyConditions else status = SeriousConditions
}

--fact updateData{
--	all pc: PrivateCustomer, t: Time, pd, rd: UserData | pc.personalData = pd and pc.recordData = rd and t = pd.timestamp and all t2: Time | 
--	t2 = t.next and rd.timestamp = t.next
--}

sig BusinessCustomer extends Customer{
	request: set Request
}

sig Request{
	subscription: one Bool
--	timestamp: one Time
}

sig IndividualRequest extends Request{
	--privateCustomer: one PrivateCustomer,
	businessCustomer: one BusinessCustomer
}
/**
sig AnonymizedRequest extends Request{
	numberOfPeople: some PrivateCustomer,
}{
	#numberOfPeople > 1000
}*/

one sig AutomatedSOS{
	subscribed: set PrivateCustomer,
	emergencyCall: PrivateCustomer one -> Bool
}
/**
fact usernameIsUnique{
	no disj  u1,u2: Customer | u1.username = u2.username
} 

fact noEmergencyCallForUnsubscribed{
	--questo per dire che per il servizio può valere solo per quelli iscritti
	no pc1: PrivateCustomer | AutomatedSOS.emergencyCall.Bool = pc1 and no pc2: PrivateCustomer | AutomatedSOS.subscribed = pc2 and
	pc2.username = pc1.username
}

fact emergencyCall{
	all pc: PrivateCustomer | AutomatedSOS.subscribed = pc and pc.status = SeriousConditions
	implies AutomatedSOS.emergencyCall[pc] = True
}**/

-- un BC può vedere i dati solo se è stata accettata la richiesta

--Cazzate

pred makeIndividualRequest[i: IndividualRequest, pc: PrivateCustomer, bc: BusinessCustomer]{
	// preconditions
	--i.privateCustomer = pc
	--one b: BusinessCustomer | b = bc
	no r1: IndividualRequest | pc.requests = r1 and r1 = i
	// postconditions
	--one r2: IndividualRequest | pc.requests = r2 and r2 = i
}

run makeIndividualRequest for 10
