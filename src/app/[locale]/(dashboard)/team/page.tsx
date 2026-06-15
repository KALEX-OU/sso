"use client";

import React, { useState } from "react";
import { useDashboard } from "../layout";
import { Button, Card, Input, Label, TextField } from "@heroui/react";
import { Users, Plus, Shield } from "lucide-react";

interface TeamItem {
  id: string;
  name: string;
  memberCount: number;
}

export default function TeamManagementPage() {
  const { showToast } = useDashboard();
  
  // Dati di test simulati
  const [teams, setTeams] = useState<TeamItem[]>([
    { id: "1", name: "Team Safety", memberCount: 3 },
    { id: "2", name: "Team Amministrazione", memberCount: 1 },
    { id: "3", name: "Team Sviluppo", memberCount: 2 }
  ]);
  const [newTeamName, setNewTeamName] = useState("");

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const newTeam: TeamItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: newTeamName,
      memberCount: 0
    };

    setTeams([newTeam, ...teams]);
    setNewTeamName("");
    showToast(`Team '${newTeam.name}' creato con successo.`, "success");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 lg:col-span-1">
          <Card.Content className="p-2 space-y-4">
            <div>
              <h3 className="text-md font-extrabold text-slate-900 dark:text-white">Nuovo Team</h3>
              <p className="text-slate-500 dark:text-gray-400 text-[10px] mt-0.5">Crea un gruppo di lavoro logico per l&apos;organizzazione.</p>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <TextField isRequired className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">Nome Team</Label>
                <Input
                  placeholder="Es. Team Sicurezza"
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-purple-500 rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all"
                />
              </TextField>
              <Button
                type="submit"
                className="w-full py-5 font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Crea Team
              </Button>
            </form>
          </Card.Content>
        </Card>

        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 lg:col-span-2">
          <Card.Content className="p-2 space-y-4">
            <div>
              <h3 className="text-md font-extrabold text-slate-900 dark:text-white">Team Attivi</h3>
              <p className="text-slate-500 dark:text-gray-400 text-[10px] mt-0.5">Gruppi e autorizzazioni ereditate per le applicazioni.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team) => (
                <div key={team.id} className="flex justify-between items-center bg-slate-100/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-200/50 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-600 dark:text-purple-400">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{team.name}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {team.memberCount} membri
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
