const User = require("../models/User")
const axios = require("axios");

const getAccessToken = async(username) => {
    const user = await User.findOne({email: username});
    if(user && user.tokens.facebook.accessToken){
        return user.tokens.facebook.accessToken;
    }
    throw new Error("Facebook access token not found for user.");
}

const fetchFacebookMessages = async (accessToken, pageId) => {
    try {
        const url = `https://graph.facebook.com/v17.0/${pageId}/conversations`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching messages from Facebook:", error.response?.data || error.message);
        throw error;
    }
};

const fetchMessagesForUser = async (userId, pageId) => {
    try {
        // Step 1: Get the user's Facebook access token
        const accessToken = await getAccessToken(userId);

        // Step 2: Fetch messages using the token
        const messages = await fetchFacebookMessages(accessToken, pageId);

        // Log or return the messages
        console.log("Fetched messages:", messages);
        return messages;
    } catch (error) {
        console.error("Failed to fetch messages:", error.message);
        throw error;
    }
};

