import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser, getLoggedInUser } from '../hooks/useAuth.js';

import '../global.css';

import AnaIcon from "../images/foto_abxa.jpeg";
import CultureIcon from "../images/culture.png";
import HomeIcon from '../images/home-icon.png';
import LarryIcon from "../images/larry-page.jpg";
import LogoIcon from "../images/icon.png";
import LogoImage from '../images/logo.png';
import ManutencaoIcon from '../images/manutencao.jpg';
import MastercardImg from '../images/mastercard.png';
import PartnerIcon from "../images/partner.png";
import PixImg from '../images/pix.png';
import SegurancaIcon from '../images/seguranca.png';
import SergeyIcon from "../images/sergey-brin.jpg";
import SuporteIcon from '../images/suporte-remoto.jpg';
import TeamIcon from '../images/team.png';
import VisaImg from '../images/visa.png';

const HomePage = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userEmail = getLoggedInUser();
        setIsLoggedIn(!!userEmail);
    }, []);

    const handleLogout = () => {
        logoutUser();
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <>
            <header className="header">
                <div className="logo-container">
                    <img src={LogoImage} alt="Logo da Empresa de TI" className="logo" />
                </div>
                <nav className="home-links">
                    {!isLoggedIn && (
                        <a href="/login" id="link-login">Login de clientes</a>
                    )}

                    <a href="/cadastro">Cadastrar novo cliente</a>

                    {isLoggedIn && (
                        <>
                            <a href="/solicitacao" id="link-solicitacao">Solicitar serviços de TI</a>
                            <button className="btn-logout" id="btn-logout" onClick={handleLogout}>Sair</button>
                        </>
                    )}
                </nav>
            </header>

            <main className="main-content">
                <section className="hero">
                    <h1>Soluções de TI feitas sob medida para o seu sucesso.</h1>
                </section>

                <section className="historia-section">
                    <div className="historia-text">
                        <h2>Nossa História</h2>
                        <blockquote>
                            Fundada em 2020, nossa empresa nasceu da paixão por tecnologia e do desejo de oferecer soluções inovadoras para empresas de todos os portes.
                        </blockquote>
                        <p>
                            Com uma equipe de especialistas dedicados, construímos uma trajetória de sucesso baseada na confiança de nossos clientes e na busca constante por excelência e inovação.
                        </p>
                    </div>
                    <div className="historia-video">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/q8tinwomjwI?si=DlX2odwG_utvLegS" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    </div>
                </section>

                <section className="servicos-section">
                    <h2>Nossos Principais Serviços</h2>
                    <div className="servicos-grid">
                        <div className="servico-item">
                            <img src={ManutencaoIcon} alt="Ícone de Manutenção" className="servico-icon" />
                            <h3>Manutenção de Computadores</h3>
                            <p>Oferecemos soluções completas para manter seus equipamentos funcionando com o máximo de desempenho, garantindo a produtividade da sua equipe.</p>
                        </div>
                        <div className="servico-item">
                            <img src={SuporteIcon} alt="Ícone de Suporte" className="servico-icon" />
                            <h3>Suporte Remoto</h3>
                            <p>Tenha a nossa equipe de especialistas pronta para resolver qualquer problema técnico de forma rápida e eficiente, sem a necessidade de deslocamento físico.</p>
                        </div>
                        <div className="servico-item">
                            <img src={SegurancaIcon} alt="Ícone de Segurança" className="servico-icon" />
                            <h3>Segurança da Informação</h3>
                            <p>Proteja seus dados e sua empresa contra ameaças digitais, como vírus, malwares e ataques cibernéticos, com as nossas soluções de cibersegurança avançada.</p>
                        </div>
                    </div>
                </section>

                <section className="midia-section">
                    <h2>Conheça Nossas Instalações</h2>
                    <div className="galeria">
                        <figure>
                            <img src={HomeIcon} alt="Instalações da empresa" />
                            <figcaption>Nossas instalações modernas.</figcaption>
                        </figure>
                        <figure>
                            <img src={TeamIcon} alt="Equipe de funcionários" />
                            <figcaption>Nossa equipe sempre pronta para ajudar.</figcaption>
                        </figure>
                        <figure>
                            <img src={CultureIcon} alt="Ambiente de trabalho" />
                            <figcaption>Um ambiente colaborativo.</figcaption>
                        </figure>
                        <figure>
                            <img src={PartnerIcon} alt="Reunião com cliente" />
                            <figcaption>Acreditamos em parcerias duradouras.</figcaption>
                        </figure>
                    </div>
                </section>

                <section className="fundadores-section">
                    <h2>Nossos Fundadores</h2>
                    <div className="fundadores-grid">
                        <div className="founder-card">
                            <img src={LarryIcon} alt="Foto de Larry Page" className="founder-photo" />
                            <h3>Larry Page</h3>
                            <h4>Co-fundador / CEO</h4>
                            <p>
                                Formado em Ciência da Computação e Engenharia na Universidade de Michigan, obteve o mestrado em Ciência da Computação na Universidade de Stanford e é conhecido por ter inventado o PageRank.
                                Especialista em gestão e inovação, com mais de 20 anos de experiência em tecnologia.
                            </p>
                        </div>
                        <div className="founder-card">
                            <img src={SergeyIcon} alt="Foto de Sergey Brin" className="founder-photo" />
                            <h3>Sergey Brin</h3>
                            <h4>Co-fundador / CTO</h4>
                            <p>
                                Formado em Matemática e Ciência da Computação na Universidade de Maryland, obteve o mestrado em Ciência da Computação na Universidade de Stanford e é conhecido por ter inventado o PageRank.
                                Arquiteto de sistemas, com vasta experiência em desenvolvimento e infraestrutura de software.
                            </p>
                        </div>
                        <div className="founder-card">
                            <img src={AnaIcon} alt="Foto de Ana Silva" className="founder-photo" />
                            <h3>Ana Alves</h3>
                            <h4>Diretora de Operações</h4>
                            <p>
                                Formada em Direito pela Universidade Federal de Pernambuco e graduanda em Ciência da Computação na CESAR School.
                                Foco em otimização de processos e experiência do cliente, garantindo a excelência operacional.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <div className="contatos">
                    <h3>Contatos</h3>
                    <ul>
                        <li><strong>Telefone:</strong> (81) 9999-9999</li>
                        <li><a href="mailto:abxa@cesar.school" style={{ color: 'white', textDecoration: 'none' }}>contato@cesar.school</a></li>
                    </ul>
                </div>
                <div className="endereco">
                    <h3>Endereço</h3>
                    <p>Av. Cais do Apolo, 77, Recife - PE, 50030-220</p>
                </div>
                <div className="pagamento">
                    <h3>Formas de Pagamento</h3>
                    <img src={VisaImg} alt="Visa" style={{ maxHeight: '2rem' }}/>
                    <img src={MastercardImg} alt="Mastercard" style={{ maxHeight: '2rem', marginLeft: '10px' }}/>
                    <img src={PixImg} alt="Pix" style={{ maxHeight: '2rem', marginLeft: '10px' }}/>
                </div>
            </footer>
        </>
    );
};

export default HomePage;