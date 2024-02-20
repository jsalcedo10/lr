import { GetServerSideProps } from "next";
import { DashboardLayout } from "../components/layouts/DashboardLayout";
import { Box, Card, Typography } from "@mui/material";
import { DashboardOutlined } from "@mui/icons-material";
import { jwt } from "../utils";

export default function DashboardPage(props) {

    const { dashboard } = props;

    return (
        <DashboardLayout
            title={dashboard.title}
            subTitle={<></>}
            icon={<DashboardOutlined />}
        >
        </DashboardLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {

    const { token = '' } = req.cookies;
    const response = await import(`../lang/${locale}.json`);

    let isValidToken = false;
    try {
        await jwt.isValidToken(token);
        isValidToken = true;

    } catch (error) {
        isValidToken = false;

    }

    if (!isValidToken) {
        return {
            redirect: {
                destination: '/auth/login?p=/',
                permanent: false,
            }
        }
    }

    return {
        props: { dashboard: response.default.dashboard }
    }
}