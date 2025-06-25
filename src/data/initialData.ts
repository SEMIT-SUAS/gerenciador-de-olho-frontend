import type { Denuncia, Acao } from '../types/ocorrencias';

export const DADOS_INICIAIS_DENUNCIAS: Denuncia[] = [
  { "id": 1, "titulo": "Buraco na Av. dos Holandeses", "descricao": "Buraco perigoso perto do retorno.", "lat": -2.4947, "lon": -44.2942, "acaoId": null, "status": "aberto" },
  { "id": 2, "titulo": "Asfalto cedendo na mesma avenida", "descricao": "Próximo ao primeiro buraco, o asfalto está afundando.", "lat": -2.4950, "lon": -44.2945, "acaoId": null, "status": "aberto" },
  { "id": 3, "titulo": "Poste sem luz na Cohama", "descricao": "Poste na praça principal está apagado há dias.", "lat": -2.5204, "lon": -44.2662, "acaoId": null, "status": "aberto" },
  { "id": 4, "titulo": "Semáforo quebrado no Renascença", "descricao": "O semáforo do cruzamento principal não está funcionando.", "lat": -2.5086, "lon": -44.2882, "acaoId": 101, "status": "em_andamento" },
  { "id": 5, "titulo": "Lixo na calçada da Colares Moreira", "descricao": "Lixo acumulado na calçada.", "lat": -2.5113, "lon": -44.2820, "acaoId": 101, "status": "em_andamento" },
  { "id": 6, "titulo": "Outro semáforo com defeito", "descricao": "Próximo ao primeiro, também está com problemas.", "lat": -2.5095, "lon": -44.2875, "acaoId": 101, "status": "em_andamento" },
  { "id": 7, "titulo": "Vazamento de água na Guajajaras", "descricao": "Vazamento contínuo de água limpa na Av. Guajajaras.", "lat": -2.5518, "lon": -44.2465, "acaoId": null, "status": "aberto" },
  { "id": 8, "titulo": "Entulho na calçada do Bequimão", "descricao": "Restos de construção bloqueando a passagem de pedestres.", "lat": -2.5367, "lon": -44.2651, "acaoId": null, "status": "aberto" },
  { "id": 9, "titulo": "Falta de iluminação na Litorânea", "descricao": "Trecho da Av. Litorânea completamente às escuras, gerando insegurança.", "lat": -2.4901, "lon": -44.2615, "acaoId": null, "status": "aberto" },
  { "id": 10, "titulo": "Bueiro entupido no Centro Histórico", "descricao": "Bueiro na Rua Portugal causando alagamento.", "lat": -2.5287, "lon": -44.3053, "acaoId": null, "status": "aberto" },
  { "id": 11, "titulo": "Ponto de ônibus sem abrigo no São Francisco", "descricao": "Passageiros esperam no sol e na chuva na Av. Castelo Branco.", "lat": -2.5195, "lon": -44.2938, "acaoId": null, "status": "aberto" },
  { "id": 12, "titulo": "Sinalização de trânsito apagada no Cohatrac", "descricao": "Faixa de pedestres quase invisível em frente à escola.", "lat": -2.5642, "lon": -44.2319, "acaoId": null, "status": "aberto" },
  { "id": 13, "titulo": "Terreno baldio com mato alto no Turu", "descricao": "Terreno na Av. São Luís Rei de França acumulando lixo e mato.", "lat": -2.5250, "lon": -44.2428, "acaoId": null, "status": "aberto" },
  { "id": 14, "titulo": "Calçada irregular na Ponta d'Areia", "descricao": "Calçada com muitos buracos, dificultando a acessibilidade.", "lat": -2.4988, "lon": -44.3094, "acaoId": null, "status": "aberto" },
  { "id": 15, "titulo": "Esgoto a céu aberto no João Paulo", "descricao": "Vala de esgoto aberta exalando mau cheiro.", "lat": -2.5411, "lon": -44.2797, "acaoId": null, "status": "aberto" },
  { "id": 16, "titulo": "Árvore com risco de queda no Monte Castelo", "descricao": "Árvore grande e antiga com galhos secos prestes a cair.", "lat": -2.5398, "lon": -44.2885, "acaoId": null, "status": "aberto" },
  { "id": 17, "titulo": "Fiação exposta em poste na Liberdade", "descricao": "Poste com fios soltos e expostos, oferecendo perigo.", "lat": -2.5445, "lon": -44.2981, "acaoId": null, "status": "aberto" },
  { "id": 18, "titulo": "Alagamento crônico na Forquilha", "descricao": "Cruzamento da Forquilha sempre alagado após chuvas.", "lat": -2.5489, "lon": -44.2403, "acaoId": null, "status": "aberto" },
  { "id": 19, "titulo": "Semáforo de pedestres inoperante no Calhau", "descricao": "Botão para travessia de pedestres na Av. dos Holandeses não funciona.", "lat": -2.4999, "lon": -44.2831, "acaoId": null, "status": "aberto" },
  { "id": 20, "titulo": "Quebra-molas sem pintura no Vinhais", "descricao": "Lombada na rua principal sem qualquer sinalização ou pintura.", "lat": -2.5186, "lon": -44.2563, "acaoId": null, "status": "aberto" },
  { "id": 21, "titulo": "Acúmulo de lixo na Feira do João Paulo", "descricao": "Após o dia de feira, o lixo permanece por dias na rua.", "lat": -2.5420, "lon": -44.2805, "acaoId": null, "status": "aberto" },
  { "id": 22, "titulo": "Cratera na via principal da Cidade Operária", "descricao": "Um buraco enorme que mais parece uma cratera na avenida principal.", "lat": -2.5891, "lon": -44.2234, "acaoId": null, "status": "aberto" },
  { "id": 23, "titulo": "Tampa de bueiro quebrada no Anil", "descricao": "Tampa de bueiro quebrada com risco de acidentes para veículos e pedestres.", "lat": -2.5457, "lon": -44.2588, "acaoId": null, "status": "aberto" },
  { "id": 24, "titulo": "Iluminação precária na ponte do São Francisco", "descricao": "A Ponte Gov. José Sarney está com muitas lâmpadas queimadas.", "lat": -2.5235, "lon": -44.3010, "acaoId": null, "status": "aberto" },
  { "id": 25, "titulo": "Descarte irregular de pneus no Tirirical", "descricao": "Área próxima ao aeroporto sendo usada como depósito de pneus velhos.", "lat": -2.5783, "lon": -44.2417, "acaoId": null, "status": "aberto" },
  { "id": 26, "titulo": "Praça abandonada na Cohab", "descricao": "Praça com brinquedos quebrados e mato alto.", "lat": -2.5596, "lon": -44.2401, "acaoId": null, "status": "aberto" },
  { "id": 27, "titulo": "Pavimentação inexistente em rua do Maiobão", "descricao": "Rua residencial no Maiobão sem asfalto, apenas lama.", "lat": -2.5815, "lon": -44.2099, "acaoId": null, "status": "aberto" },
  { "id": 28, "titulo": "Obra inacabada na Av. Jerônimo de Albuquerque", "descricao": "Canteiro de obras abandonado atrapalhando o trânsito.", "lat": -2.5321, "lon": -44.2505, "acaoId": null, "status": "aberto" },
  { "id": 29, "titulo": "Veículo abandonado na Alemanha", "descricao": "Carro abandonado ocupando uma vaga na rua há meses.", "lat": -2.5402, "lon": -44.2850, "acaoId": null, "status": "aberto" },
  { "id": 30, "titulo": "Pichação em monumento no Centro", "descricao": "Monumento histórico na Praça Deodoro foi pichado.", "lat": -2.5312, "lon": -44.3025, "acaoId": null, "status": "aberto" },
  { "id": 31, "titulo": "Ciclofaixa apagada na Av. Carlos Cunha", "descricao": "A pintura da ciclofaixa está desgastada e quase não se vê.", "lat": -2.5155, "lon": -44.2783, "acaoId": null, "status": "aberto" },
  { "id": 32, "titulo": "Parada de ônibus danificada na Camboa", "descricao": "Estrutura da parada de ônibus está enferrujada e quebrada.", "lat": -2.5333, "lon": -44.2959, "acaoId": null, "status": "aberto" },
  { "id": 33, "titulo": "Falta de rampa de acessibilidade no Renascença II", "descricao": "Calçada em frente a um centro comercial sem rampa para cadeirantes.", "lat": -2.5058, "lon": -44.2891, "acaoId": null, "status": "aberto" },
  { "id": 34, "titulo": "Trânsito perigoso na rotatória do aeroporto", "descricao": "Falta de sinalização adequada causa confusão e risco de acidentes.", "lat": -2.5847, "lon": -44.2345, "acaoId": null, "status": "aberto" },
  { "id": 35, "titulo": "Muro com risco de desabamento no Coroado", "descricao": "Muro de contenção apresentando rachaduras perigosas.", "lat": -2.5510, "lon": -44.2698, "acaoId": null, "status": "aberto" },
  { "id": 36, "titulo": "Animais soltos na pista na zona rural", "descricao": "Cavalos e gado frequentemente invadem a BR-135 na saída da cidade.", "lat": -2.6319, "lon": -44.2522, "acaoId": null, "status": "aberto" }
];

export const DADOS_INICIAIS_ACOES: Acao[] = [
  { id: 101, nome: "Manutenção de Semáforos - Renascença", secretaria: "Secretaria de Trânsito", lat: -2.5098, lon: -44.2859, polygonCoords: [[-2.5086, -44.2882], [-2.5113, -44.2820], [-2.5095, -44.2875]], status: 'concluido' },
];
