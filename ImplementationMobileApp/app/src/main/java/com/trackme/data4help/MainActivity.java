package com.trackme.data4help;

import HttpClient.AuthToken;
import HttpClient.Data4HelpAsyncClient;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.BottomNavigationView;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.widget.*;
import com.loopj.android.http.JsonHttpResponseHandler;
import cz.msebera.android.httpclient.Header;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private TextView mTextMessage;
    private LinearLayout content;
    private static final List<String> JSONUserDataFields = Collections.unmodifiableList(new ArrayList<String>() {
        {
            add("_hearthRate");
            add("_maxBloodPressure");
            add("_minBloodPressure");
            add("_lat");
            add("_long");
            add("_timeOfAcquisition");

        }
    });

    private BottomNavigationView.OnNavigationItemSelectedListener mOnNavigationItemSelectedListener
            = new BottomNavigationView.OnNavigationItemSelectedListener() {

        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem item) {
            switch (item.getItemId()) {
                case R.id.navigation_home:
                    setTitle(R.string.title_home);
                    drawUserData();
                    return true;
                case R.id.navigation_requests:
                    setTitle(R.string.title_requests);
                    content.removeAllViews();
                    return true;
                case R.id.navigation_send_user_data:
                    setTitle(R.string.title_send_data);
                    content.removeAllViews();
                    return true;
            }
            return false;
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        content = findViewById(R.id.content);
        drawUserData();
        BottomNavigationView navigation = (BottomNavigationView) findViewById(R.id.navigation);
        navigation.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener);
    }

    private void drawUserData(){
        final Context thisContext = this;
        Data4HelpAsyncClient.post("/api/userdata",null,new JsonHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                try {
                    for(int i = 0; i < response.length();i++){
                        JSONObject row = response.getJSONObject(i);

                        for (String s: JSONUserDataFields) {
                            TextView textView = new TextView(thisContext);
                            textView.setText(s + ": " + row.getString(s));
                            content.addView(textView);
                        }
                        TextView textView = new TextView(thisContext);
                        textView.setText("------------------------------");
                        content.addView(textView);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }

            }

            @Override
            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                try {
                    throw throwable;
                } catch (Throwable throwable1) {
                    throwable1.printStackTrace();
                }
                Log.v("ERROR >> ", responseString + "\nCode: " + String.valueOf(statusCode));
            }
        });

    }

}
