package com.pushlink.cordova.actions;

import android.content.Context;
import org.apache.cordova.CallbackContext;
import org.json.JSONObject;

import com.pushlink.android.PushLink;

public class SetIdleAction implements PushLinkPluginAction {
  private static final String IDLE = "idle";

  @Override
  public void execute(Context context, JSONObject arg, CallbackContext callbackContext) throws Exception {
    PushLink.idle(arg.getBoolean(IDLE));
  }
}