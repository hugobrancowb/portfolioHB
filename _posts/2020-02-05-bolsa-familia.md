---
layout: post
title: "Mineração de Dados do Portal da Transparência - Uma breve análise dos pagamentos do Bolsa Família ao longo dos anos"
ghcode: bolsa_familia_data
lang: pt
lang-ref: bolsa-familia
date: 2020-02-12 13:50:00 -0300
description: Escrevi um código em JavaScript para adquirir 467.826 dados referentes a 7 anos de pagamentos do Programa Bolsa Família.
img: bolsa_capa.jpg
fig-caption: #
tags: [Bolsa Família, Data Mining, Mineração de Dados, Web Scraping, JavaScript]
permalink: bolsa-familia
script: true
---
## O Portal da Transparência

O [Portal da Transparência](portaldatransparencia.gov.br/) é um site lançado em 2004 com o objetivo de fornecer ao cidadão informações sobre como o dinheiro público do Governo Federal é gasto. O Portal ganhou força quando a [Lei do Acesso à Informação](http://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm) entrou em vigor em 2012 e os órgãos públicos passaram a ser obrigados a publicar informações referentes a despesas, convênios, licitações e contratos, entre outros tipos de conteúdos.

Em 2018 o site ganhou uma nova cara, oferecendo recursos inéditos como maior e melhor oferta de dados abertos, adequação a plataformas móveis, melhor usabilidade e mais recursos gráficos. [Segundo a Agência Brasília](https://www.agenciabrasilia.df.gov.br/2020/02/04/portal-da-transparencia-tem-aumento-expressivo-de-audiencia-em-janeiro/), o site teve aumento de 83% nas visualizações em Janeiro de 2020 quando comparado ao mesmo período do ano anterior.

![Novo site e informações disponíveis para o cidadão.]({{site.baseurl}}/assets/img/bolsa_site.png)

Na busca de bons exemplos publicados quanto à clareza das informações, me deparo com algumas [notícias publicadas](http://mds.gov.br/area-de-imprensa/noticias/2019/abril/bolsa-familia-repassa-r-2-6-bilhoes-a-beneficiarios-em-abril) pela Secretaria Especial do Desenvolvimento Social descrevendo pagamentos do Bolsa Família, programa social do Governo lançado em 2003. Os relatórios são resumidos, diretos e informativos, verdadeiros exemplos, porém encontram-se escondidos em meio às diversas publicações do site, obrigando o usuário a realizar uma pesquisa no site para encontrar, entre as diversas páginas de resultados, dados exclusivamente mensais sobre os pagamentos realizados pelo Programa.

### Falta clareza

Um grande problema encontrado na forma da qual os dados do Programa Bolsa Família são apresentados é a impossibilidade de obter um resumo generalizado de todos os repasses feitos pelo Governo Federal. Essa falta de clareza na apresentação dos dados vai contra a proposta da Lei de informar o cidadão sobre os gastos públicos através do Portal. A Lei do Acesso à Informação diz que os sites dos órgãos e entidades públicas devem _conter ferramenta de pesquisa de conteúdo que permita o acesso à informação de forma objetiva, transparente, clara e em linguagem de fácil compreensão._

No Portal da Transparência, os dados de repasse são exibidos _apenas_ de forma mensal e _apenas_ para cada município. Para citar alguns exemplos, o cidadão encontra-se, de certa forma, impossibilitado de acessar o quanto foi repassado para seu estado num determinado mês, o quanto foi repassado para seu município num período de tempo ou mesmo o total repassado pelo governo para o país inteiro. Quando uso a expressão _“de certa forma”_ quero dizer que sim, é possível obter esse tipo de informação (que será exibida durante esse artigo), os dados estão disponíveis, o problema está no escalonamento da informação desejada: para calcular quanto foi repassado para todos os municípios durante o ano de 2019, por exemplo, o cidadão comum deveria acessar mais de 1.200 diferentes páginas para, manualmente, somar mais de 61 mil repasses feitos durante todo o período.

O site até oferece a opção de baixar todos os pagamentos realizados, um mês por vez. Cada arquivo contém cerca de 180 mb a serem baixados numa velocidade bastante lenta, demorando mais de 15 minutos para terminar o _download _de um mês_._ O arquivo recebido de um único mês é do tipo `.csv` e possui mais de 1 GB de tamanho.

Thiago Guimarães, num [projeto realizado em 2016](https://medium.com/@thiagogsr/trabalhando-com-arquivos-do-portal-da-transpar%C3%AAncia-27d2f2500da5), baixou todos arquivos referentes a esse mesmo ano e provou ser inviável para o cidadão comum trabalhar com os dados fornecidos no formato disponível; no total, 7 GB de dados foram descompactados gerando 14 milhões de linhas de dados. Para ter uma noção dessa quantidade de dados, cada _worksheet_ do Excel só permite que pouco mais de 1,04 milhão de linhas sejam carregadas de cada vez.

Decidi então fazer uma análise dos dados disponíveis no Portal sobre a distribuição de verba federal para o Bolsa Família, programa social do Governo lançado em 2003. Os repasses realizados desde 2013 estão disponíveis no Portal para consultas públicas.

## Mineração de Dados

Para obter todos os dados de repasse federal, escrevi alguns códigos em JavaScript a fim de arrecadar todas essas informações sem a necessidade do trabalho manual e excluindo o erro humano de todo processo de seleção e soma de informações. Os repasses são exibidos em tabelas de, no máximo, 50 linhas por página mas o fato de que o conteúdo é carregado através de eventos de JavaScript torna o processo de mineração automatizada muito mais complicado.

![Amostra da tabela de pagamentos exibida no Portal da Transparência.]({{site.baseurl}}/assets/img/bolsa_tabela.png)

Escrevi três códigos diferentes em JavaScript para cada etapa desse projeto e explico um pouco sobre eles a seguir. Todos códigos utilizados, assim como o _dataset_ obtido nesse processo encontram-se publicamente disponíveis em minha [página do Github](https://github.com/hugobrancowb/bolsa_familia_data).


### Etapa 1: download das informações

O primeiro código utiliza os módulos _Puppeteer_ e _Cheerio_ para acessar e selecionar os dados da tabela de cada página acessada. _Puppeteer_ trata-se de um navegador web sem interface de usuário: basta que eu forneça os comandos que desejo executar, como acessar um site ou clicar em um link, e o módulo opera de forma automática sem que haja a necessidade de um usuário utilizar o mouse, teclado, ou mesmo estar presente durante a navegação e nos retorna um arquivo de texto com todo o código html obtido na página. A partir daí, _Cheerio_ responsabiliza-se por coletar as informações presentes em determinados trechos da página; no caso desse projeto, trata-se das células da tabela de repasses, que contém as informações de estado, município, mês e ano e o valor do repasse em questão.

O processo de mineração dura algum tempo: além da espera necessária para o carregamento de cada página, o código ainda possui alguns comandos de pausa para prevenir que meu acesso ao Portal fosse bloqueado por excesso de visitas (o que chegou a acontecer). Para evitar que as informações fossem perdidas caso o programa de mineração encontrasse algum erro no processo, todos dados são salvos em arquivo `.json` antes de prosseguir para a próxima página. **Como resultado da mineração, foram gerados 9.358 arquivos contendo todas informações coletadas ao longo de 2019.**

### Etapa 2: unificação dos dados obtidos

O objetivo principal do segundo programa criado é unir todos arquivos gerados na mineração em apenas um arquivo `.json`. Todos 9.358 arquivos gerados na etapa 1 são unificados em um único arquivo `.json`, **totalizando 467.826 dados importados.**

### Etapa 3: agrupamento anual dos repasses

Na última etapa, o arquivo `.json` que contém todos dados coletados é acessado e as informações de repasse são formatadas de acordo com seu tipo (_string_, _float_, etc) e copiadas para diferentes vetores de acordo com a segmentação ou filtro desejado (como todos repasses do estado de Pernambuco ou todos repasses do ano de 2019, por exemplo).

## Resultados

O total dos pagamentos realizados durante 2019 para cada estado são apresentados abaixo nos formatos barra e mapa espacial. Até o dia da publicação deste artigo, os pagamentos do mês de Dezembro de 2019 ainda não haviam sido adicionados à plataforma.

![Mapa espacial representando pagamentos do Programa Bolsa Família para cada estado em 2019.]({{site.baseurl}}/assets/img/bolsa_brasil-hm.png)

Para melhor ilustrar a distribuição de renda pelo país, foram criados os dois gráficos tipo pizza abaixo: no primeiro, representa-se os pagamentos realizados para cada região ao longo do ano; já no segundo, esse valor total é dividido número total de habitantes em cada região, mesmo que esses necessariamente não recebam o benefício. Desta forma torna-se mais fácil notar que as regiões Norte e Nordeste estão quase empatadas sendo as regiões que mais necessitam do benefício; a região Sul, por sua vez, recebe a menor quantidade de benefício por habitante.

Por fim, o último gráfico exibe a progressão dos pagamentos para cada ano de dados disponível no Portal. A título de comparação, resolvi dividir cada valor total pelo respectivo salário mínimo de cada ano a fim de mensurar, qualitativamente, se os pagamentos do Programa acompanham ou não o aumento do salário. Como resultado, observamos que de 2014 a 2017 os pagamentos tiveram queda constante em seu valor proporcional, com um indicativo de melhora em 2018. Observe que essa queda acompanhou a crise econômica do país, [que teve início em 2014](https://g1.globo.com/economia/noticia/crise-economica-atrasou-o-desenvolvimento-do-brasil-em-3-anos-aponta-firjan.ghtml).


>Todos dados utilizados nesse artigo estão [disponíveis em meu repositório no Github](https://github.com/hugobrancowb/bolsa_familia_data).


## Referências

Vetor do mapa do Brasil: [Free Vector Maps](https://freevectormaps.com/brazil/BR-EPS-01-0003?ref=atr)

Gráficos: [Plotly](https://plot.ly/javascript/)

Foto: [Flickr do Senado Federal](https://www.flickr.com/photos/agenciasenado/15413884445/)