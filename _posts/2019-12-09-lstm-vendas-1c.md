---
layout: post
title: "Previsão de vendas utilizando Redes Neurais LSTM"
ghcode: LSTMForecastSells
lang: pt
lang-ref: lstmvendas1c
date: 2019-12-19 12:00:00 -0300
description: Aplicação de uma rede neural para a previsão de lucros para o mês seguinte em uma grande loja de eletrônicos.
img: graficosvendas1c_cover.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [Inteligência Artificial,Data Analysis,Matlab]
permalink: lstm-previsao-vendas
---
## Introdução
Uma base de dados constituída de vendas ao longo de um período foi fornecida pela [1C Company](http://www.1c.com/) para uma competição de *data science* realizada pela [Kaggle](https://www.kaggle.com/). O objetivo é criar uma estimativa de lucros para o próximo mês de vendas para a rede de lojas. No total, **2 milhões de registros** de vendas são processados utilizando Matlab como linguagem/*software* principal para a execução da análise e previsão.

## Base de Dados
A base de dados utilizada nesse projeto consiste de um registro diário de vendas de uma rede de lojas voltada para o mercado de tecnologia e entretenimento. A tabela de vendas, fornecida em formato ```.cvs```, contém informações de data de venda do produto, seu código de registro, quantidade e seu valor da venda em Rublos (moeda russa); todos registros estão dentro do intervalo de 01/01/2013 e 30/09/2014 e seus dados não precisam passar por *data cleaning*.

![Uma amostra da base de dados.]({{site.baseurl}}/assets/img/1CPS-exemplo.png)

## Análise preliminar dos dados
### Análise por produto
Começamos segmentando os dados de venda para que cada produto vendido seja analisado isoladamente. A partir da segmentação, podemos analisar quais são os produtos mais vendidos utilizando critérios como quantidade e valor arrecadado.

![As 10 maiores arrecadações no intervalo de 21 meses de análise de acordo com os produtos vendidos; arrecadação em Rublos.]({{site.baseurl}}/assets/img/graficosvendas1c_top10-profits.png)

Considerando o gráfico acima observa-se que consoles e jogos para diferentes plataformas compõe quase todo ranking mas seria necessário observar uma grande quantidade de dados para dizer qual dos nichos dá maior retorno à empresa. Portanto, essa análise é feita à partir de um novo algoritmo.

### Análise por tipo de produto
A base de dados faz uma associação entre cada produto (```item_id```) e a categoria que melhor o representa (```item_categories```). Para fazer a conexão entre esses dados é preciso ler e interligar três arquivos ```.cvs``` e obter uma das **84 categorias** à partir de ```item_id``` de cada produto. As categorias foram traduzidas do russo por [David Eargle](https://daveeargle.com/). Os resultados obtidos apresentam-se a seguir.

![As 10 maiores arrecadações no intervalo de 21 meses de análise de acordo com as categorias dos produtos vendidos; arrecadação em Rublos.]({{site.baseurl}}/assets/img/graficosvendas1c_top10-profits-categories.png)

A análise nos informa que **jogos para PS3 eram os produtos mais lucrativos para a empresa** (lembrando que as vendas ocorreram entre 2013 e 2014), **totalizando 15% do lucro** gerado em vendas. A figura abaixo apresenta os lucros de todas 84 categorias.

![Lucros totais de cada categoria de produto; valores menores que 2M₽ não são exibidos.]({{site.baseurl}}/assets/img/graficosvendas1c_allprofits.png)

Cada produto ou categoria possui um comportamento de vendas diferente no intervalo de tempo contido na amostra. Na figura abaixo apresentamos todas as vendas distribuídas ao longo do tempo da categoria *Jogos para PS3* (a categoria mais lucrativa) no intervalo da base de dados para observar seu comportamento.

![Lucro gerado pela venda de Jogos para PS3 ao longo do tempo. A primeira figura apresenta o lucro gerado a cada dia enquanto a segunda apresenta o lucro acumulado ao longo do tempo.]({{site.baseurl}}/assets/img/graficosvendas1c_profit-from-toplucrative.png)

#### O que isso nos diz?
A análise da arrecadação das vendas pode indicar para equipe de marketing quais categorias mais lucrativas podem ser exploradas nas publicidades da empresa a fim de aumentar o lucro total obtido.
Além disso, foi observado que oito categorias de produtos tiveram um total de **zero vendas** durante o período analisado, ou seja, há uma alocação de recursos humanos e financeiros além de ocupação de estoque que podem ser revertidas sem que haja interferência na taxa de vendas das lojas.

## Previsão de vendas a partir da base de dados
### Escolha do modelo
Para fazer previsões de vendas, é prática comum realizar uma Regressão Linear sobre a receita acumulada ao longo do tempo. Nela, cria-se uma reta que possua a melhor configuração pra representar toda receita gerada pelas vendas ao longo do tempo com o menor erro associado ao ajuste de pontos.

Após alguma pesquisa, foi decidido comparar esse método mais simples e tradicional da Regressão Linear com um tipo de inteligência artificial, nesse caso, uma *LSTM* (sigla para *Long Short-Term Memory*). Antes de realizar a previsão final, testou-se tanto o método da Regressão Linear quanto LSTM em todas categorias de itens; dos 638 dias registrados na base, os 607 primeiros foram utilizados para treinar os modelos e os últimos 31 dias foram usados para validação dos mesmos; isso significa que os modelos vão tentar prever as vendas nos últimos 31 dias conhecidos baseados nos 607 demais dias. Na imagem abaixo apresentam-se os MSRE (sigla para *Mean Square Root Error*, ou Erro Médio Quadrático Relativo) associados a cada modelo aplicado sobre as 84 categorias. **Os valores MSRE dos modelos LSTM foram menores que os modelos lineares em mais de 83% das categorias no teste de validação**, portanto esse modelo é escolhido para realizar a previsão das vendas. 

![MSRE nos testes de validação dos dois modelos. Na figura apresentam-se apenas os 44 maiores valores relacionados ao erro; os demais foram omitidos apenas para fins ilustrativos.]({{site.baseurl}}/assets/img/graficosvendas1c_MSRE-tests.png)

### Previsão por categoria
A configuração da Rede *LSTM* escolhido é igual para todas as categorias: cinco dias consecutivos são utilizados para realizar a previsão das vendas no sexto. Para cada categoria, seu respectivo conjunto de 638 dias de vendas conhecidas é usado para alimentar a rede neural em seu treinamento 180 vezes antes de realizar qualquer previsão.

Na figura abaixo temos a ilutração de previsão para aquela categoria mais lucrativa. Na cor verde apresentam-se os últimos 31 dias de vendas presentes na base de dados e em vermelho a previsão de vendas realizada pela rede neural.

![Previsão nas vendas dia-a-dia para a categoria "Jogos para PS3" para o mês de Outubro de 2014.]({{site.baseurl}}/assets/img/graficosvendas1c_ps3games-profitforecast.png)

### Resultado final da previsão de vendas
O trabalho de previsão foi árduo: para cada uma das 84 categorias uma rede neural é criada para ser treinada com ```638 * 180 = 114840``` dias. Após as repetições de treino, **mais de 360 milhões de registros de venda são utilizados para o treinamento das Redes LSTM** a fim de obtermos a previsão final para o mês de Outubro de 2014, exibida na figura abaixo. Nota-se que há uma previsão de aumento para a verba de entrada superior a 37% em relação ao mês anterior.

![Comparação entre o último mês de vendas e a previsão para o mês seguinte. Os valores são exibidos em milhões de Rublos.]({{site.baseurl}}/assets/img/graficosvendas1c_profitresults.png)
