import { ReactElement, useState, useEffect } from "react";
import Container from "./Container";
import Card from "./components/Card";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import { useAuthConfig } from "./context/AuthConfigContext";

interface ResponseState {
    ok: boolean;
    status: number;
    statusText: string;
    url: string;
    type: string;
    message: string;
}


function MongoDBLogger(): ReactElement {
    const {fullURL} = useAuthConfig()
    const [response, setResponse] = useState<ResponseState>({
        ok: false,
        status: 404,
        statusText: "Express HTTP Server not started",
        url: fullURL("ping"),
        type: "N/A",
        message: "Connection Refused",
    });
    
    const pingBackend = async () => {
        const response: Response = await fetch(fullURL("ping"));
        const message = await response.text();
        if (!response.ok) {
            return;
        }
        const { ok, status, statusText, url, type } = response!;
        setResponse({
            ok,
            status,
            statusText, 
            url,
            type,
            message
        })
    };

    useEffect(() => {
        pingBackend();
    }, []);

    const { ok, status, statusText, url, type, message } = response!;
    return (
        <Container>
            <Card title='MongoDB Server Status'>
                <table id='db-logger-table'>
                    <tbody>
                        <tr>
                            <th>Server Status</th>
                            <td>
                                <Brightness1Icon
                                    fontSize='small'
                                    htmlColor={ok ? "green" : "red"}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Response Code</th>
                            <td>{status}</td>
                        </tr>
                        <tr>
                            <th>Status Text</th>
                            <td>{statusText}</td>
                        </tr>
                        <tr>
                            <th>URL</th>
                            <td>{url}</td>
                        </tr>
                        <tr>
                            <th>Type</th>
                            <td>{type}</td>
                        </tr>
                        <tr>
                            <th>Message</th>
                            <td>{message}</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </Container>
    );
}

export default MongoDBLogger;
