import { Container, Text } from "@chakra-ui/react";

const NoPage = () => {
    return(
        <Container maxW="xl" centerContent>
            <Text 
            fontSize={"3xl"}
            height={"100%"}
            >
                Page 404 not found
            </Text>
        </Container>
    )
}

export default NoPage;