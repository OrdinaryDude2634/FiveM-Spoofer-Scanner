import { input, number, select, Separator } from '@inquirer/prompts';



export class UI {
    static choosePresetOrCustomID() {
        return select({
            message: 'Use a preset or provide a custom ID??',
            choices: [
                {
                    name: 'Preset',
                    value: 'preset'
                },
                {
                    name: 'Custom ID',
                    value: 'custom'
                },
                new Separator(),
                {
                    name: 'Set Steam Account Age Check Timeout(20 seconds default)',
                    value: 'delay'
                }
            ]
        });
    }

    static choosePreset() {
        return select({
            message: 'Which server do you want to scan?',
            choices: [
                {
                    name: 'Overland(Iranian)',
                    value: '64l4k4'
                },
                {
                    name: 'Diamond(Iranian)',
                    value: 'jox9jk'
                },
                {
                    name: 'Paradise(Iranian)',
                    value: '4r3rgo'
                }
            ]
        });
    }

    static promptCustomID() {
        return input({
            message: 'Enter the server\'s ID(e.g. 64l4k4)',
            required: true
        });
    }

    static promptTimeout() {
        return number({
            message: 'Enter timeout delay (milliseconds)',
            required: true,
            min: 5000,
            max: 1000000000
        });
    }
}