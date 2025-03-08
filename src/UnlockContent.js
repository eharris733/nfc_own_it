import React, { useState } from "react";
import axios from "axios";

const UnlockContent = () => {
    const [token, setToken] = useState("");

    const handleUnlock = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/unlock", { token });
            alert(response.data.message);
        } catch (err) {
            alert("Error unlocking content!" + err);

        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter your token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
            />
            <button onClick={handleUnlock}>Unlock Content</button>
        </div>
    );
};

export default UnlockContent;
