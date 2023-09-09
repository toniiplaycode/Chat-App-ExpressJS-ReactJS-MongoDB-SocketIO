import { Skeleton, Stack } from "@chakra-ui/react";

const ChatLoading = () => {
    return(
        // dùng để loading khi search user
        <Stack pt={"20px"} height={"90%"}>
            <Skeleton height='10%'/>
            <Skeleton height='10%'/>
            <Skeleton height='10%'/>
            <Skeleton height='10%'/>
            <Skeleton height='10%'/>
            <Skeleton height='10%'/>
            <Skeleton height='10%'/>
            <Skeleton height='10%'/>
            <Skeleton height='10%'/>
        </Stack>
    )
}

export default ChatLoading;