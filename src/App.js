import React, { useState, useEffect } from 'react';
import ContatoForm from './components/ContatoForm';
import ContatoItem from './components/ContatoItem';
import ModalEdicao from './components/ModalEdicao';
import ModalConfirmacao from './components/ModalConfirmacao'; 
import { Container } from 'react-bootstrap';

const App = () => {
  const [contatos, setContatos] = useState([]);
  const [contatoEditando, setContatoEditando] = useState(null);
  const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false);

  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [contatoSelecionado, setContatoSelecionado] = useState(null);

  
  useEffect(() => {
    const contatosSalvos = localStorage.getItem('contatos');
    if (contatosSalvos) {
      setContatos(JSON.parse(contatosSalvos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contatos', JSON.stringify(contatos));
  }, [contatos]);

  const adicionarContato = (contato) => {
    const novo = { ...contato, id: Date.now() };
    setContatos([...contatos, novo]);
  };

  const abrirModalEdicao = (contato) => {
    setContatoEditando(contato);
    setMostrarModalEdicao(true);
  };

  const salvarEdicao = (id, contatoAtualizado) => {
    const atualizados = contatos.map((c) => 
      c.id === id ? { ...contatoAtualizado, id } : c
    );
    setContatos(atualizados);
    setMostrarModalEdicao(false);
    setContatoEditando(null);
  };

  const confirmarExclusao = (contato) => {
    setContatoSelecionado(contato);
    setMostrarModalConfirmacao(true);
  };

  const deletarContato = (id) => {
    const filtrados = contatos.filter((c) => c.id !== id);
    setContatos(filtrados);
  };

  const deletarConfirmado = () => {
    deletarContato(contatoSelecionado.id);
    setMostrarModalConfirmacao(false);
    setContatoSelecionado(null);
  };

  return (
    <Container className="my-4">
      <ContatoForm adicionarContato={adicionarContato} />
      {contatos.map((contato) => (
        <ContatoItem
          key={contato.id}
          contato={contato}
          abrirModalEdicao={() => abrirModalEdicao(contato)}
          confirmarExclusao={() => confirmarExclusao(contato)}
        />
      ))}

      {mostrarModalEdicao && (
        <ModalEdicao
          contato={contatoEditando}
          fecharModal={() => {
            setMostrarModalEdicao(false);
            setContatoEditando(null);
          }}
          salvarEdicao={salvarEdicao}
        />
      )}

      <ModalConfirmacao
        show={mostrarModalConfirmacao}
        onClose={() => {
          setMostrarModalConfirmacao(false);
          setContatoSelecionado(null);
        }}
        onConfirm={deletarConfirmado}
        contato={contatoSelecionado}
      />
    </Container>
  );
};

export default App;
