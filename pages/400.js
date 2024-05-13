import Head from "next/head";

export default function brokenLink() {
  return (
    <div
      style={{
        color: "#000",
        background: "#fff",
        height: "100vh",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Head>
        <title>Broken Link</title>
        <meta
          name="description"
          content="notion habits tracker with diagrams"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1
          style={{
            display: "inline-block",
            borderRight: "1px solid rgba(0, 0, 0, 0.3)",
            margin: "0",
            marginRight: "20px",
            padding: "10px 23px 10px 0",
            fontSize: "24px",
            fontWeight: "500",
            verticalAlign: "top",
          }}
        >
          400
        </h1>
        <div
          style={{
            display: "inline-block",
            textAlign: "left",
            lineHeight: "49px",
            height: "49px",
            verticalAlign: "middle",
          }}
        >
          <h2
            style={{
              fontSize: "14px",
              fontWeight: "normal",
              lineHeight: "inherit",
              margin: "0",
              padding: "0",
            }}
          >
            Not possible to get the data from Notion. You should probably repeat{" "}
            <a
              style={{
                fontSize: "14px",
                fontWeight: "normal",
                lineHeight: "inherit",
                color: "blue",
              }}
              href="/add"
            >
              the setup process
            </a>
            .
          </h2>
        </div>
      </div>
    </div>
  );
}
