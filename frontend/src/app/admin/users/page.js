"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "../../../components/ui/Container";
import Card, { CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Alert from "../../../components/ui/Alert";
import Badge from "../../../components/ui/Badge";
import Spinner from "../../../components/ui/Spinner";
import Modal from "../../../components/ui/Modal";

export default function AdminUsersPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    nivel_acesso: "cliente",
    senha: "",
  });

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    const token = localStorage.getItem("techrent_token");

    if (!raw || !token) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(raw);
    setUser(userData);

    // Verificar se é admin
    if (userData.nivel_acesso !== "admin") {
      router.push("/dashboard");
      return;
    }

    // Buscar usuários
    fetch("http://localhost:3001/usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const listU2 = Array.isArray(data) ? data : (Array.isArray(data?.dados) ? data.dados : []); setUsuarios(listU2);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditingId(usuario.id);
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        nivel_acesso: usuario.nivel_acesso,
        senha: "",
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: "",
        email: "",
        nivel_acesso: "cliente",
        senha: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      nome: "",
      email: "",
      nivel_acesso: "cliente",
      senha: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("techrent_token");

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3001/usuarios/${editingId}`
        : "http://localhost:3001/usuarios";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.sucesso) {
        setSuccess(
          editingId
            ? "Usuário atualizado com sucesso!"
            : "Usuário criado com sucesso!"
        );
        handleCloseModal();
        // Recarregar lista
        const response = await fetch("http://localhost:3001/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const newData = await response.json();
        const listU3 = Array.isArray(newData) ? newData : (Array.isArray(newData?.dados) ? newData.dados : []); setUsuarios(listU3);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.mensagem || "Erro ao salvar usuário");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

    const token = localStorage.getItem("techrent_token");

    try {
      const response = await fetch(`http://localhost:3001/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.sucesso) {
        setSuccess("Usuário deletado com sucesso!");
        setUsuarios(usuarios.filter((u) => u.id !== id));
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.mensagem || "Erro ao deletar usuário");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "tecnico":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "cliente":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-8 py-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 animate-slide-in-from-bottom">
          <div>
            <h1 className="text-4xl font-bold text-slate-100">Gerenciar Usuários</h1>
            <p className="text-slate-400 mt-2">Crie, edite e delete usuários do sistema</p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            + Novo Usuário
          </Button>
        </div>

        {/* Mensagens */}
        {error && (
          <Alert variant="destructive" className="animate-slide-in-from-bottom">
            <p>⚠ {error}</p>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="animate-slide-in-from-bottom">
            <p>✓ {success}</p>
          </Alert>
        )}

        {/* Tabela de Usuários */}
        <Card className="border-slate-700/50 glass-dark animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle>Lista de Usuários ({usuarios?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/30">
                    <th className="text-left p-3 text-slate-300">ID</th>
                    <th className="text-left p-3 text-slate-300">Nome</th>
                    <th className="text-left p-3 text-slate-300">Email</th>
                    <th className="text-left p-3 text-slate-300">Função</th>
                    <th className="text-left p-3 text-slate-300">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios && usuarios.length > 0 ? (
                    usuarios.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-slate-700/20 hover:bg-slate-800/30 transition"
                      >
                        <td className="p-3 text-slate-400">#{u.id}</td>
                        <td className="p-3 text-slate-200">{u.nome}</td>
                        <td className="p-3 text-slate-300">{u.email}</td>
                        <td className="p-3">
                          <Badge className={getRoleColor(u.nivel_acesso)}>
                            {u.nivel_acesso?.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenModal(u)}
                            className="text-xs"
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(u.id)}
                            className="text-xs"
                          >
                            Deletar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-slate-400">
                        Nenhum usuário encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal de Criar/Editar */}
        <Modal isOpen={showModal} onClose={handleCloseModal}>
          <Card className="border-slate-700/50 bg-slate-950 w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingId ? "Editar Usuário" : "Novo Usuário"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Nome *
                  </label>
                  <Input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="bg-slate-800 border-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-slate-800 border-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Função *
                  </label>
                  <select
                    name="nivel_acesso"
                    value={formData.nivel_acesso}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="cliente">Cliente</option>
                    <option value="tecnico">Técnico</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Senha {editingId ? "(deixe em branco para não mudar)" : "*"}
                  </label>
                  <Input
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required={!editingId}
                    className="bg-slate-800 border-slate-600"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Salvar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </Modal>
      </div>
    </Container>
  );
}
