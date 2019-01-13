package com.trackme.data4help.Model;

import android.view.View;

/**
 * Used to let the recycler view comunicate with the activity it's in.
 *
 */
public interface IRecyclerViewCallback {
    void onClick(View v, int pos);
}
