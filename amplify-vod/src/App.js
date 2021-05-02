import React, { useEffect, useState } from "react";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { createVideo } from "./graphql/mutations";
import { listVideos, cloudinarysignature } from "./graphql/queries";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = {
  name: "",
  description: "",
  cloudinary: null,
};

// eslint-disable-next-line no-unused-vars
async function fetchCloudinarySignature(cb, params) {
  try {
    const cSign = await API.graphql(
      graphqlOperation(cloudinarysignature, { msg: JSON.stringify(params) })
    );
    const data = JSON.parse(cSign.data.cloudinarysignature);
    console.log(`Uploading using key ${data.body}`);
    return data.body;
  } catch (err) {
    console.log("error fetching signature");
  }
}

const App = () => {
  const [formState, setFormState] = useState(initialState);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  const uploadWidget = window.cloudinary.createUploadWidget(
    {
      cloudName: "dgclxe3tj",
      uploadPreset: "gzx7kuig",
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        console.log("Done! Here is the video info: ", result.info);
        setInput("cloudinary", JSON.stringify(result.info));
      }
      if (error) {
        console.log(error);
      }
    }
  );

  const showWidget = () => {
    fetchCloudinarySignature();
    uploadWidget.open();
  };

  async function fetchVideos() {
    try {
      const videoData = await API.graphql(graphqlOperation(listVideos));
      const videos = videoData.data.listVideos.items;
      videos.map((video) => {
        video.cloudinary = JSON.parse(video.cloudinary);
      });
      setVideos(videos);
    } catch (err) {
      console.log("error fetching videos");
    }
  }

  async function addVideo() {
    try {
      if (!formState.name || !formState.description) return;
      const video = { ...formState };
      setVideos([...videos, video]);
      setFormState(initialState);
      await API.graphql(graphqlOperation(createVideo, { input: video }));
    } catch (err) {
      console.log("error creating video:", err);
    }
  }

  return (
    <div style={styles.container}>
      <h2>Vistendo Videos</h2>
      <p>
        Simple Video Application demonstration utilizing Cloudinary API. To
        begin, click "Upload Video" to upload your asset. Fill out the
        corresponding "Video Title" and "Username" form and then proceed to
        click "Add Video". Afterwards, refresh the page to view your content
        added to the list of videos.
      </p>
      <button
        style={styles.uploadButton}
        className="cloudinary-button"
        onClick={showWidget}
      >
        Upload Video
      </button>
      <input
        onChange={(event) => setInput("name", event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Video Title"
        required
      />
      <input
        onChange={(event) => setInput("description", event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Username"
      />
      <button style={styles.button} onClick={addVideo}>
        Add Video
      </button>
      {videos.map((video, index) => (
        <div key={video.id ? video.id : index} style={styles.video}>
          <p style={styles.videoName}>{video.name}</p>
          <p style={styles.videoDescription}>{video.description}</p>
          <div style={styles.vids}>
            <video controls muted width="768" height="432">
              <source
                src={video.cloudinary.secure_url}
                type="video/mp4"
              ></source>
            </video>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  vids: {
    minWidth: "1000px",
    maxWidth: "1000px",
  },
  container: {
    width: 770,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  video: { marginBottom: 15 },
  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  videoName: { fontSize: 23, fontWeight: "bold" },
  videoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: "black",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px 0px",
  },
  uploadButton: { margin: "22px" },
};

export default App;
