import { SafeAreaView, Text } from "react-native";
import LottieView from "lottie-react-native";

import Animation from '../assets/lottie/Animation.json'

export default function SplashScreenComponent({ onFinish = (isCancelled) => { } }: { onFinish?: (isCancelled: boolean) => void }) {
    return (
        <LottieView
            source={Animation}
            onAnimationFinish={onFinish}
            autoPlay
            resizeMode="cover"
            loop={false}
            style={{
                flex: 1,
                width: "100%"
            }}
        />
    )
}