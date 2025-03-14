import { AxiosResponse } from 'axios';
import {
	Configuration,
	CreateCompletionResponse,
	OpenAIApi,
	CreateCompletionRequestPrompt,
} from 'openai';
import tunnel from 'tunnel';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
	// organization: process.env.OPENAI_ORG_ID,
});
const openai = new OpenAIApi(configuration);

interface OpenAIModelTypes {
	complete: (
		prompt: CreateCompletionRequestPrompt
	) => Promise<AxiosResponse<CreateCompletionResponse, any>>;
}

function createOpenAIModel() {
	return {
		complete: async (prompt: CreateCompletionRequestPrompt) => {
			try {
				const response = await openai.createCompletion(
					{
						model: 'text-davinci-003',
						prompt,
						temperature: 0.5,
						max_tokens: 256,
						top_p: 1,
						frequency_penalty: 0,
						presence_penalty: 0,
					},
					{
						httpsAgent: tunnel.httpsOverHttp({
							proxy: {
								host: '127.0.0.1',
								port: 51915,
							},
						}),
					}
				);
				return response;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
	};
}

function AIChatModel() {}
AIChatModel.getInstance = (function () {
	let openAIModel: OpenAIModelTypes | null;
	return function () {
		if (!openAIModel) {
			openAIModel = createOpenAIModel();
		}

		return openAIModel;
	};
})();

export default AIChatModel;
