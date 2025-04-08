import * as Dotenv from "dotenv";
import {z} from "zod"


Dotenv.config();

const EnvSchame = z.object({
    PORT: z.string().regex(/^\d+$/, { message: 'PORT deve ser um número' }),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(1, "JWT_SECRET não definido nas variáveis de ambiente.")
});

const parseEnv = EnvSchame.safeParse(process.env);

//se a validação falhar, lançar um erro com os detalhes
if(!parseEnv.success) {
    console.error("Erro na validação das variáveis de ambiente: \n");
    console.error(parseEnv.error.format());
    process.exit(1); //interromper a execução se a validação falhar
}

//tipar o ambiente validado 
type Env = z.infer<typeof EnvSchame>;

export const env: Env = parseEnv.data;