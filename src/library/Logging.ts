import chalk from "chalk";

// This file is for logging messages in different colors based on the type of the message in my terminal, instead of boring console-log. chalk makes it easy to use colors, and I add current timestamps and emojis as well

export default class Logging {
    public static log = (args: any) => this.info(args);
    public static info = (args: any) => console.log(chalk.blue(`[${new Date().toLocaleString()}] [INFO] 💪`), typeof args === "string" ? chalk.blueBright(args) : args);
    public static warn = (args: any) => console.log(chalk.yellow(`[${new Date().toLocaleString()}] [WARN] ⚠`), typeof args === "string" ? chalk.yellowBright(args) : args);
    public static error = (args: any) => console.log(chalk.red(`[${new Date().toLocaleString()}] [ERROR] 😕`), typeof args === "string" ? chalk.redBright(args) : args);
    
}