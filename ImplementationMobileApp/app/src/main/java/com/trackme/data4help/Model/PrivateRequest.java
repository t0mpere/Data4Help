package com.trackme.data4help.Model;

import java.util.Date;

public class PrivateRequest{
    private Date date;
    private String BCEmail;
    private String PCEmail;
    private Boolean accepted;

    /**
     *Class used to represent the data structure of the PrivateRequest.
     */
    public PrivateRequest(Date date, String BCEmail, String PCEmail, int accepted) {
        this.date = date;
        this.BCEmail = BCEmail;
        this.PCEmail = PCEmail;
        this.accepted = (accepted == 1);
    }

    public Date getDate() {
        return date;
    }

    public String getBCEmail() {
        return BCEmail;
    }

    public String getPCEmail() {
        return PCEmail;
    }

    public Boolean getAccepted() {
        return accepted;
    }
}