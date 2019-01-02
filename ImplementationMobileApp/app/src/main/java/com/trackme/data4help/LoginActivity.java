package com.trackme.data4help;

import HttpClient.AuthToken;
import HttpClient.Data4HelpAsyncClient;
import HttpClient.Data4HelpJsonResponseHandler;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import com.loopj.android.http.JsonHttpResponseHandler;
import cz.msebera.android.httpclient.Header;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * A login screen that offers login via email/password.
 */
public class LoginActivity extends AppCompatActivity {



    private EditText passwordTextField;
    private EditText emailTextField;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        emailTextField = findViewById(R.id.emailField);
        passwordTextField = (EditText) findViewById(R.id.passwordField);
        passwordTextField.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView textView, int id, KeyEvent keyEvent) {
                if (id == EditorInfo.IME_ACTION_DONE || id == EditorInfo.IME_NULL) {
                    attemptLogin();
                    return true;
                }
                return false;
            }
        });
        Button logInButton = (Button) findViewById(R.id.buttonLogIn);
        logInButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                attemptLogin();
            }
        });

    }

    private void attemptLogin() {
        String email = emailTextField.getText().toString();
        String password = passwordTextField.getText().toString();
        final Toast toast = Toast.makeText(this,"",Toast.LENGTH_SHORT);

        if(email.isEmpty() || password.isEmpty()){
            toast.setText("Insert email and password");
            toast.show();
        }else {
            //AuthToken.createToken(email,password);
            AuthToken.createToken("cami.231298@gmail.com","passuord");
            Data4HelpAsyncClient.post("/api/login", null, new Data4HelpJsonResponseHandler(this) {
                @Override
                public void onSuccess(int statusCode, Header[] headers, JSONObject response) {

                    Log.v("Success", response.toString());
                    try {
                        if(response.getBoolean("auth")){
                            toast.setText("Success");
                            toast.show();
                            startActivity(new Intent(getContext(),MainActivity.class));
                        }else {
                            AuthToken.deleteToken();
                            toast.setText("Login failed");
                            toast.show();
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });
        }

    }




}

