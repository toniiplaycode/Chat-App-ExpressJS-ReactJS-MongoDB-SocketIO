import { Container, Box, Text, TabList, Tabs, Tab, TabPanel, TabPanels } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const HomePage = () => {

    
    return(
        <Container maxW="xl" centerContent>
            <Box
            textAlign={"center"}
            p={3}
            bg={"white"}
            w={"100%"}
            m={"40px 0 15px 0"}
            borderRadius={"lg"}
            >
                <Text fontSize={"4xl"}>Chat App</Text>
            </Box>

            <Box
            p={4}
            bg={"white"}
            w={"100%"}
            borderRadius={"lg"}
            >
                <Tabs variant='soft-rounded' colorScheme='blue'>
                    <TabList>
                        <Tab w={"50%"}>Login</Tab>
                        <Tab w={"50%"}>Sign up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login/>
                        </TabPanel>
                        <TabPanel>
                            <Signup/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
    
}

export default HomePage;