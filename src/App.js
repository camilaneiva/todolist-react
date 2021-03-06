import React, { useState, useEffect } from 'react'
import {
  Botao,
  Container,
  Formulario,
  Input,
  Titulo,
  ContainerLista,
  Item,
  Wrapper,
  Texto,
  Icone,
  WrapperIcone,
  ModalContainer,
  Modal,
  BotaoFecharModal,
  InputModal,
  BotaoSalvarModal,
  FormularioEdicao
} from './style'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { v4 } from 'uuid'

export const App = () => {
  const [lista, setLista] = useState(
    JSON.parse(localStorage.getItem('lista')) ?? []
  )
  const [texto, setTexto] = useState('')
  const [modal, setModal] = useState(false)
  const [textoModal, setTextoModal] = useState('')
  const [idAtual, setIdAtual] = useState('')

  const adicionarItem = (event) => {
    event.preventDefault()
    if (texto) {
      setLista([...lista, { texto: texto, id: v4(), check: false }])
      setTexto('')
    }
  }

  const excluir = (id) => {
    setLista(lista.filter((item) => item.id !== id))
  }

  const abrirEdicao = (id, texto) => {
    setModal(true)
    setTextoModal(texto)
    setIdAtual(id)
  }

  const fecharModal = () => {
    setModal(false)
  }

  const finalizarEdicao = (event) => {
    event.preventDefault()
    const b = lista.find((item) => {
      return item.id === idAtual
    })
    const novoItem = { texto: textoModal, id: idAtual, check: b.check }
    const novoItem2 = { texto: textoModal, id: b.id, check: b.check }
    const novoItem3 = { ...b, texto: textoModal }

    const a = lista.map((item) => {
      if (item.id === idAtual) {
        return novoItem
      } else {
        return item
      }
    })
    setLista(a)
    fecharModal()
  }

  const ticar = (check, id) => {
    const a = lista.find((item) => {
      return item.id === id
    })

    const novoItem = { ...a, check: check ? false : true }
    const novoItem2 = { ...a, check: !check }

    const b = lista.map((item) => (item.id === id ? novoItem : item))
    setLista(b)
  }

  const fecharModalEsc = (event) => {
    if (event.key.toUpperCase() === 'ESCAPE' && modal) {
      setModal(false)
    }
  }

  const fecharModalClick = (event) => {
    if (event.target.id === 'modalContainer') {
      setModal(false)
    }
  }

  useEffect(() => {
    localStorage.setItem('lista', JSON.stringify(lista))
  }, [lista])

  useEffect(() => {
    window.addEventListener('keydown', fecharModalEsc)
    return () => window.removeEventListener('keydown', fecharModalEsc)
  }, [modal])

  return (
    <Container>
      <Titulo>My To Do List</Titulo>

      <Formulario onSubmit={adicionarItem}>
        <Input
          type="text"
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
        />
        <Botao type="submit">Adicionar</Botao>
      </Formulario>
      <ContainerLista>
        {lista.map(({ texto, id, check }) => {
          return (
            <Item key={id}>
              <Wrapper>
                <input
                  type="checkbox"
                  checked={check}
                  onClick={() => ticar(check, id)}
                />
                <Texto riscarTexto={check}>{texto}</Texto>
              </Wrapper>
              <WrapperIcone>
                <Icone
                  onClick={() => abrirEdicao(id, texto)}
                  icon={faEdit}
                ></Icone>
                <Icone onClick={() => excluir(id)} icon={faTrashAlt}></Icone>
              </WrapperIcone>
            </Item>
          )
        })}
      </ContainerLista>
      {modal && (
        <ModalContainer id="modalContainer" onClick={fecharModalClick}>
          <Modal>
            <BotaoFecharModal onClick={fecharModal}>x</BotaoFecharModal>
            <FormularioEdicao onSubmit={finalizarEdicao}>
              <InputModal
                type="text"
                htmlFor="text"
                value={textoModal}
                onChange={(event) => setTextoModal(event.target.value)}
              />
              <BotaoSalvarModal>Salvar</BotaoSalvarModal>
            </FormularioEdicao>
          </Modal>
        </ModalContainer>
      )}
    </Container>
  )
}
