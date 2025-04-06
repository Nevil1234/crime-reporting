export const COMETCHAT_CONSTANTS = {
    APP_ID: "27283344db0330c7",
    REGION: "IN",
    AUTH_KEY: "deed11f0baf8c952845b074836c6bad7aa5bb78c",
    UID_PREFIX: {
      OFFICER: "OFFICER_",
      COMPLAINANT: "USER_"
    }
  };
  
  export const initializeCometChat = async () => {
    const { CometChat } = await import("@cometchat-pro/chat");
    const appID = process.env.APP_ID;
    const region = process.env.REGION;
    
    const appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .build();
  
    await CometChat.init(appID, appSetting);
    return CometChat;
  };
  