create table BusinessCustomers
(
	email varchar(100) not null
		primary key,
	password varchar(45) not null,
	timestamp timestamp default CURRENT_TIMESTAMP not null,
	name varchar(45) null,
	partitaIva varchar(11) null,
	address varchar(45) null,
	comune varchar(45) null,
	nazione varchar(45) null,
	sessionID varchar(255) null,
	active tinyint(1) default '0' null,
	constraint partitaIva_UNIQUE
		unique (partitaIva)
)
;

create table PrivateCustomers
(
	email varchar(100) not null
		primary key,
	password varchar(45) not null,
	subToAutomatedSOS binary(1) default '0' null,
	timestamp timestamp default CURRENT_TIMESTAMP not null,
	name varchar(45) null,
	surname varchar(45) null,
	sex varchar(45) null,
	placeOfBirth varchar(45) null,
	placeOfBirthProvincia varchar(2) null,
	dateOfBirth date null,
	codiceFiscale varchar(16) null,
	sessionID varchar(255) null,
	constraint codiceFiscale_UNIQUE
		unique (codiceFiscale)
)
;

create table PrivateRequest
(
	timestamp timestamp default CURRENT_TIMESTAMP not null,
	accepted tinyint(1) default '0' not null,
	BusinessCustomers_email varchar(100) not null,
	PrivateCustomers_email varchar(100) not null,
	primary key (BusinessCustomers_email, PrivateCustomers_email),
	constraint fk_PrivateRequest_BusinessCustomers1
		foreign key (BusinessCustomers_email) references BusinessCustomers (email),
	constraint fk_PrivateRequest_PrivateCustomers1
		foreign key (PrivateCustomers_email) references PrivateCustomers (email)
)
;

create index fk_PrivateRequest_BusinessCustomers1_idx
	on PrivateRequest (BusinessCustomers_email)
;

create index fk_PrivateRequest_PrivateCustomers1_idx
	on PrivateRequest (PrivateCustomers_email)
;

create table Queries
(
	timeOfSubmission timestamp default CURRENT_TIMESTAMP null,
	BusinessCustomer_email varchar(100) not null,
	title varchar(100) null,
	periodical tinyint(1) default '0' null,
	closed tinyint default '0' null,
	date_from datetime null,
	date_to datetime null,
	lat_sw float(10,7) null,
	long_sw float(10,7) null,
	age_from int null,
	age_to int null,
	id int auto_increment,
	next_update timestamp null,
	lat_ne float(10,7) null,
	long_ne float(10,7) null,
	primary key (id, BusinessCustomer_email),
	constraint businessCustomer_email_fk
		foreign key (BusinessCustomer_email) references BusinessCustomers (email)
)
;

create index businessCustomer_email_fk
	on Queries (BusinessCustomer_email)
;

create table QueriesData
(
	id int default '0' not null,
	bc_email varchar(100) not null,
	avg_bp_min float null,
	avg_bp_max float null,
	avg_bpm float null,
	num int null,
	timestamp timestamp default '0000-00-00 00:00:00' not null,
	primary key (id, bc_email, timestamp),
	constraint queries_fk
		foreign key (id, bc_email) references Queries (id, BusinessCustomer_email)
)
;

create table UserData
(
	PrivateCustomers_email varchar(100) not null,
	hearthRate int(3) not null,
	minBloodPressure int(3) not null,
	maxBloodPressure int(3) not null,
	lat double(9,7) null,
	`long` double(9,7) null,
	timestamp timestamp default CURRENT_TIMESTAMP not null,
	timeOfAcquisition timestamp default '0000-00-00 00:00:00' not null,
	id int auto_increment,
	age int null,
	primary key (PrivateCustomers_email, timeOfAcquisition),
	constraint UserData_id_uindex
		unique (id),
	constraint fk_UserData_PrivateCustomers
		foreign key (PrivateCustomers_email) references PrivateCustomers (email)
)
;

create view Customers as
SELECT `Data4Help`.`PrivateCustomers`.`email` AS `email`
  FROM `Data4Help`.`PrivateCustomers`
  UNION ALL SELECT `Data4Help`.`BusinessCustomers`.`email` AS `email`
            FROM `Data4Help`.`BusinessCustomers`;

