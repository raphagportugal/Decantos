# Domínio Decantos

Este diretório documenta a arquitetura futura do produto editorial Decantos.

Por enquanto, o site continua consumindo MDX local. Os tipos em `types/` são contratos de domínio para orientar a evolução da Mesa de Escrita, da curadoria e das futuras relações entre leitores e Decantações.

## Atores

- Leitor: pessoa que lê, pode futuramente favoritar e comentar.
- Autor: pessoa que escreve Decantações.
- Curador: pessoa que organiza o acervo, revisa e publica.

## Entidade central

A Decantação é a unidade editorial principal. Todo fluxo futuro deve orbitar em torno dela: rascunho, revisão, publicação, arquivo e leitura.

## Direção futura

- `/mesa` deve evoluir para criação de rascunhos.
- A publicação deve continuar sendo uma decisão editorial, não um botão automático.
- Comentários e favoritos são relações futuras, não funcionalidades ativas nesta sprint.
- Nenhum adaptador de banco, autenticação ou CMS deve ser introduzido antes de uma decisão explícita de infraestrutura.
