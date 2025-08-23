import { useUserQuery } from "@/api/user/user.query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  Trash2,
  Calendar,
  Briefcase,
  Star,
  Target,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Experience } from "@/types/user.types";
import { AddExperienceModal } from "@/components/AddExperienceModal";
import { AddSkillModal } from "@/components/AddSkillModal";
import { AddAreaModal } from "@/components/AddAreaModal";
import { useSkillQueries } from "@/api/skill/skill.query";
import { useSkillMutation } from "@/api/skill/skill.mutation";
import { useAreaQuery } from "@/api/area/area.query";
import { useUserMutation } from "@/api/user/user.mutation";

export const Route = createFileRoute("/(private-routes)/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { useGetLoggedUser } = useUserQuery();
  const { data: user, isLoading, error } = useGetLoggedUser();

  const { useListSkillsByUserQuery } = useSkillQueries();
  const { useRemoveSkillMutation } = useSkillMutation();
  const { useGetUserAreaQuery } = useAreaQuery();

  const { data: userSkills, isLoading: isLoadingUserSkills } =
    useListSkillsByUserQuery();
  const { data: userArea, isLoading: isLoadingUserArea } =
    useGetUserAreaQuery();
  const removeSkillMutation = useRemoveSkillMutation();

  const { useRequestUserSummaryMutation } = useUserMutation();
  const requestUserSummaryMutation = useRequestUserSummaryMutation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Erro ao carregar perfil
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    });
  };

  const handleRemoveSkill = (userSkillId: string) => {
    removeSkillMutation.mutate(userSkillId);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações</p>
        </div>

        {/* Profile Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" />
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                  {user.user_summary ? (
                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Aprovado
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      Pendente
                    </Badge>
                  )}
                </div>
                {!user.user_summary && (
                  <Button size="sm" variant="outline" onClick={() => requestUserSummaryMutation.mutate()} disabled={requestUserSummaryMutation.isPending}>
                    Solicitar Avaliação
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="experiences" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="experiences">Experiências</TabsTrigger>
            <TabsTrigger value="skills">Competências</TabsTrigger>
            <TabsTrigger value="areas">Área</TabsTrigger>
          </TabsList>

          <TabsContent value="experiences" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Experiências</h2>
              <AddExperienceModal />
            </div>

            {user.experiences && user.experiences.length > 0 ? (
              <div className="space-y-3">
                {user.experiences.map((exp: Experience) => (
                  <Card key={exp.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{exp.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {exp.description}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(exp.startDate)} -{" "}
                        {exp.endDate ? formatDate(exp.endDate) : "Atual"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Briefcase className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Nenhuma competência cadastrada
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Competências</h2>
              <AddSkillModal />
            </div>

            {userSkills && userSkills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {userSkills.map((userSkill: any) => (
                  <Card key={userSkill.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">
                            {userSkill.name}
                          </CardTitle>
                          {userSkill.description && (
                            <CardDescription className="text-sm">
                              {userSkill.description}
                            </CardDescription>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveSkill(userSkill.id)}
                            disabled={removeSkillMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : isLoadingUserSkills ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-muted-foreground">
                    Carregando competências...
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Star className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Nenhuma competência cadastrada
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="areas" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Área de Atuação</h2>
              {!userArea && <AddAreaModal />}
            </div>

            {isLoadingUserArea ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Carregando área...</p>
                </CardContent>
              </Card>
            ) : userArea ? (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <Target className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {userArea.name}
                        </CardTitle>
                        {userArea.description && (
                          <CardDescription className="text-base mt-1">
                            {userArea.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-muted-foreground">
                    Área definida em{" "}
                    {new Date(userArea.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <Target className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhuma área definida
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Defina sua área de atuação para melhorar sua visibilidade no
                    sistema.
                  </p>
                  <AddAreaModal />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
