import React from 'react';

const KillSwitch = () => {
    return (
        <html lang="en">
            <head>
                <title>503 Service Unavailable</title>
                <style dangerouslySetInnerHTML={{ __html: `
                    body { font-family: "Courier New", Courier, monospace; text-align: center; padding: 150px; background-color: #f4f4f4; color: #333; }
                    h1 { font-size: 50px; }
                    p { font-size: 20px; }
                    .error-code { color: #d9534f; font-weight: bold; }
                    hr { width: 50%; border: 0; border-top: 1px solid #ccc; margin: 20px auto; }
                `}} />
            </head>
            <body>
                <h1>503 Service Unavailable</h1>
                <p className="error-code">Error Code: DATABASE_CONNECTION_TIMEOUT</p>
                <hr />
                <p>The server is temporarily unable to service your request due to maintenance downtime or capacity problems.</p>
                <p>Please contact your system administrator or service provider to restore access.</p>
            </body>
        </html>
    );
};

export default KillSwitch;
