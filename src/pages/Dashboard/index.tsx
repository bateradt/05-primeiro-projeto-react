import React, {useState, FormEvent, useEffect} from 'react';
import { FiChevronRight } from 'react-icons/fi';
import {Link} from 'react-router-dom';

import logoImg from '../../assets/logo.svg';
import { Title, Form, Repositories, Error} from './styles';
import api from '../../services/api';

interface Repository {
  id : number;
  full_name: string;
  name : string;
  description: string;
  owner: {
    login: string;
    avatar_url : string;
  }
}

// todo componente criado em React com Typescript deve ser do tipo React.FC React.FunctionComponent
const Dashboard: React.FC = () => {
  const [inputError, setInputError] = useState('');
  const [newRepo, setNewRepo] = useState('');

  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    } else {
      return [];
    }

  });

  useEffect(() => {
    localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
  }, [repositories]);

  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite um autor/repositório para pesquisar.');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch(err) {
      setInputError('Não foi possível buscar o repositório no github. ' + err.message);
    }
  }

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore repositórios no GitHub</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
        value= {newRepo}
        onChange={e => setNewRepo(e.target.value)}
        placeholder="Digite o nome do repositório" />
        <button type="submit">Pesquisar</button>
      </Form>

     {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <Link key={repository.id} to={`repositories/${repository.full_name}`}>
          <img
            src={repository.owner.avatar_url}
            alt={repository.owner.login}
          />

          <div>
            <strong>{repository.full_name}</strong>
            <p>{repository.description}</p>
          </div>

          <FiChevronRight size={20} />
        </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
