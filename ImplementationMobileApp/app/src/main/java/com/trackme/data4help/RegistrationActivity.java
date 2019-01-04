package com.trackme.data4help;

import HttpClient.AuthToken;
import HttpClient.Data4HelpAsyncClient;
import HttpClient.Data4HelpJsonResponseHandler;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.*;
import com.loopj.android.http.RequestParams;
import cz.msebera.android.httpclient.Header;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegistrationActivity extends AppCompatActivity implements View.OnClickListener {

    Button submitButton;
    EditText nameEditText;
    EditText surnameEditText;
    EditText emailEditText;
    EditText passwordEditText;
    EditText dateEditText;
    EditText codiceFiscaleEditText;
    RadioGroup radioGroupSex;
    RadioButton radioButtonMale;
    RadioButton radioButtonFemale;
    EditText comuneEditText;
    public static final Pattern VALID_EMAIL_ADDRESS_REGEX =
            Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        AuthToken.deleteToken();
        setContentView(R.layout.activity_registration);
        submitButton = findViewById(R.id.buttonSubmit);
        submitButton.setOnClickListener(this);
        nameEditText = findViewById(R.id.editTextName);
        surnameEditText = findViewById(R.id.editTextSurname);
        emailEditText = findViewById(R.id.editTextEmail);
        passwordEditText = findViewById(R.id.editTextPassword);
        dateEditText = findViewById(R.id.editTextDateOfBirth);
        codiceFiscaleEditText = findViewById(R.id.editTextCodiceFiscale);
        radioGroupSex = findViewById(R.id.radioButtonGroupSex);
        comuneEditText = findViewById(R.id.editTextComune);
        radioButtonFemale = findViewById(R.id.radioButtonFemale);
        radioButtonMale = findViewById(R.id.radioButtonMale);
    }

    public static boolean validate(String emailStr) {
        Matcher matcher = VALID_EMAIL_ADDRESS_REGEX .matcher(emailStr);
        return matcher.find();
    }

    @Override
    protected void onResume() {
        super.onResume();
        AuthToken.deleteToken();
    }

    @Override
    public void onClick(View v) {
        RequestParams requestParams = new RequestParams();
        boolean isMale = true;
        if(nameEditText.getText().toString().isEmpty()||
            surnameEditText.getText().toString().isEmpty()||
            emailEditText.getText().toString().isEmpty()||
            passwordEditText.getText().toString().isEmpty()||
            dateEditText.getText().toString().isEmpty()||
            comuneEditText.getText().toString().isEmpty()||
            codiceFiscaleEditText.getText().toString().isEmpty()){
            makeToast("Complete all fields");
            return;
        }
        if(!validate(emailEditText.getText().toString())){
            makeToast("Invalid email");
            return;
        }
        if(radioButtonFemale.isChecked()){
            isMale = false;
        }
        if(radioButtonMale.isChecked()){
            isMale = true;
        }

        requestParams.add("email",emailEditText.getText().toString());
        requestParams.add("password",passwordEditText.getText().toString());
        requestParams.add("name",nameEditText.getText().toString());
        requestParams.add("surname",surnameEditText.getText().toString());
        requestParams.add("dateOfBirth",dateEditText.getText().toString());
        requestParams.add("placeOfBirth",comuneEditText.getText().toString());
        requestParams.add("codiceFiscale",codiceFiscaleEditText.getText().toString());
        requestParams.add("sex",isMale? "M":"F");

        Log.v("params: ",requestParams.toString());

        Data4HelpAsyncClient.post("/api/register_pc",requestParams,new Data4HelpJsonResponseHandler(this){
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                try {
                    if(!response.getBoolean("result")){
                        makeToast("Inserted Params are not valid\n maybe you are already registered or you've\n inserted a wrong \"Codice Fiscale\"");
                    }else {
                        Intent intent = new Intent(getContext(),LoginActivity.class);
                        makeToast("Success");
                        startActivity(intent);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    private void makeToast(String msg){
        Toast.makeText(this,msg,Toast.LENGTH_LONG).show();
    }
}
