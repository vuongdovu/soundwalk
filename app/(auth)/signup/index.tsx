import { Host, VStack } from '@expo/ui/swift-ui';
import { ScrollView, TextInput } from 'react-native';

const signup = () => {
    return(
        <ScrollView>
            <Host>
                <VStack>
                    <TextInput
                        placeholder='hiiiiiiii'
                    ></TextInput>
                </VStack>
            </Host>
        </ScrollView>
        
    );
}

export default signup;