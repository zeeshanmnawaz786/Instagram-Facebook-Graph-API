import Head from "next/head";

import { useEffect, useState } from "react";

import styles from "../styles/Home.module.css";

export default function Home() {
  const [user, setUser] = useState({ name: "", id: "" });
  const [uiLogin, setLogin] = useState(true);
  const [accessToken, setAccessToken] = useState();
  const [pageId, setPageId] = useState();
  const [pageAccessToken, setPageAccessToken] = useState();
  const [grantedScopes, setGrantedScopes] = useState();
  const [postText, setPostText] = useState();

  const [instaBusinessID, setInstaBusinessID] = useState();
  const [instaMediaID, setInstaMediaID] = useState();

  console.log("pageId", pageId);
  console.log("pageAccessToken", pageAccessToken);

  useEffect(() => {
    // FACEBOOK
    // const app_id = "page ID";

    // INSTAGRAM
    const app_id = "page ID";

    console.log("app_id", app_id);
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: app_id,
        autoLogAppEvents: true,
        xfbml: true,
        version: "v15.0",
      });
      window.FB.getLoginStatus(function (response) {
        if (response.status === "connected") {
          console.log(response.authResponse);

          setAccessToken(response.authResponse.accessToken);
          setGrantedScopes(response.authResponse.grantedScopes);
          FB.api(
            `/me/accounts?access_token=${response.authResponse.accessToken}`,
            function (response) {
              if (response && !response.error) {
                setPageAccessToken(response?.data?.[0].access_token);
                setPageId(response?.data?.[0].id);
              }
            }
          );
          FB.api("/me", function (response) {
            setUser(response);
          });
          setLogin(false);
        } else if (response.status === "not_authorized") {
          setLogin(true);
        } else {
          setLogin(true);
        }
      });
    };
  }, []);

  const login = () => {
    try {
      FB.login(
        function (response) {
          if (response.authResponse) {
            // response all data
            console.log(response);
            // response all data

            setAccessToken(response.authResponse.accessToken);
            setGrantedScopes(response.authResponse.grantedScopes);

            FB.api(
              `/me/accounts?access_token=${response.authResponse.accessToken}`,

              function (response) {
                if (response && !response.error) {
                  setPageAccessToken(response?.data?.[0].access_token);

                  setPageId(response?.data?.[0].id);
                }
              }
            );

            FB.api("/me", function (response) {
              setUser(response);
            });

            FB.api(
              `me/accounts?fields=instagram_business_account`,
              function (response) {
                // console.log("Instagram Business Response", response.data);

                for (let i = 0; i < response.data.length; i++) {
                  const element = response.data[0];

                  setInstaBusinessID(element?.instagram_business_account?.id);
                  console.log(
                    "Instagram Business ID",
                    element?.instagram_business_account?.id
                  );
                }
                // setInstaBusinessID(response);
              }
            );

            // console.log("instaGram Bussiness Account ID", instaBusinessID);

            setLogin(false);
          } else {
            console.log("User cancelled login or did not fully authorize.");
          }
        },

        {
          // scope: "public_profile,pages_read_engagement,pages_manage_posts",
          scope:
            "ads_management, business_management, instagram_basic, instagram_content_publish, pages_read_engagement",

          return_scopes: true,
        }
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  const post = () => {
    FB.api(
      // FACEBOOK

      // post image
      // `/${pageId}/photos?url=https://lh3.googleusercontent.com/5Ecse55Ysa3Ju5f4Idr1qt_LMn53mZd5j1Xk1NYGKp1_QQG8IutJX-7RoHPMW-3JPv3qxp_7Qd_ZPuNVm2O5eZQIXQ=w640-h400-e365-rj-sc0x00ffffff&access_token=${pageAccessToken}`,
      // post text
      // `/${pageId}/feed?message=${postText}&access_token=${pageAccessToken}`,
      // get likes
      // `/${pageId}/feed?fields=comments.limit(1).summary(true)&likes.limit(1).summary(true)&access_token=${pageAccessToken}`,

      // `/${pageId}/feed?fields=likes.limit(1).summary(true)&access_token=${pageAccessToken}`,
      // "GET",

      // "POST",

      // console.log(
      //   instaBusinessID
      // ) // INSTAGRAM
      `/${instaBusinessID}/media?image_url=https://cdn.pixabay.com/photo/2015/06/19/21/24/avenue-815297_960_720.jpg&access_token=${pageAccessToken}`,
      "POST",

      function (response) {
        console.log(response.error?.message);
        if (response && !response.error) {
          // console.log(response.data[0].likes.summary);
          console.log(response);
          setInstaMediaID(response.id);
        }
      }

      // console.log("instagram media ID", instaMediaID)

      // facebook Response

      // function (response) {
      //   console.log(response.error?.message);
      //   if (response && !response.error) {
      //     console.log(response.data[0].likes.summary);
      //   }
      // }
    );
  };

  const post_publish = () => {
    console.log("Instagram Media ID", instaMediaID);
    FB.api(
      `/${instaBusinessID}/media_publish?creation_id=${instaMediaID}&access_token=${pageAccessToken}`,
      "POST",

      function (response) {
        console.log(response.error?.message);
        if (response && !response.error) {
          console.log(response);
          setInstaMediaID(response);
        }
      }
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {!uiLogin && (
          <>
            <h1 className={styles.title}>
              {user.name}
              <br />
              {user.id}
            </h1>
            <p>{grantedScopes}</p>
            <br />
            <br />
            <br />
            <textarea
              style={{ width: "500px", fontSize: "18px", padding: "10px" }}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Message..."
              rows="8"
            />

            <button
              onClick={post}
              style={{ padding: "12px 50px 12px 50px", marginTop: "20px" }}
            >
              post
            </button>

            <button
              onClick={post_publish}
              style={{ padding: "12px 50px 12px 50px", marginTop: "20px" }}
            >
              post publish
            </button>
          </>
        )}

        {uiLogin && (
          <button
            onClick={login}
            style={{ padding: "12px 50px 12px 50px", marginTop: "20px" }}
          >
            login
          </button>
        )}
      </main>

      <footer className={styles.footer}>Powered by FaceBook API</footer>
    </div>
  );
}
