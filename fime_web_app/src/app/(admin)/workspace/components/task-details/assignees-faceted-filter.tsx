"use client";

import type { FacetedFilterOption } from "@/types/data-table";
import { CustomFacetedFilter } from "@/app/(admin)/workspace/components/task-details/custom-faceted-filter";

interface AssigneesFacetedFilterProps {
  teams: { id: string; name: string }[];
  gens: { id: string; name: string }[];
  selectedTeamIds: Set<string>;
  selectedGenIds: Set<string>;
  onTeamFilterChange: (teamIds: Set<string>) => void;
  onGenFilterChange: (genIds: Set<string>) => void;
}

export function AssigneesFacetedFilter({
  teams,
  gens,
  selectedTeamIds,
  selectedGenIds,
  onTeamFilterChange,
  onGenFilterChange,
}: AssigneesFacetedFilterProps) {
  // Convert teams to FacetedFilterOption format
  const teamOptions: FacetedFilterOption[] = teams.map((team) => ({
    label: team.name,
    value: team.id,
    // Count users in each team
    // count: allUsers.filter((user) => user.teamId === team.id).length,
  }));

  // Convert gens to FacetedFilterOption format
  const genOptions: FacetedFilterOption[] = gens.map((gen) => ({
    label: gen.name,
    value: gen.id,
    // Count users in each gen
    // count: allUsers.filter((user) => user.genId === gen.id).length,
  }));

  // Custom handlers for the CustomFacetedFilter
  const handleTeamSelect = (value: string) => {
    const newSelectedTeamIds = new Set(selectedTeamIds);
    if (newSelectedTeamIds.has(value)) {
      newSelectedTeamIds.delete(value);
    } else {
      newSelectedTeamIds.add(value);
    }
    onTeamFilterChange(newSelectedTeamIds);
  };

  const handleGenSelect = (value: string) => {
    const newSelectedGenIds = new Set(selectedGenIds);
    if (newSelectedGenIds.has(value)) {
      newSelectedGenIds.delete(value);
    } else {
      newSelectedGenIds.add(value);
    }
    onGenFilterChange(newSelectedGenIds);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <CustomFacetedFilter
        title="Ban"
        options={teamOptions}
        selectedValues={selectedTeamIds}
        onValueSelect={handleTeamSelect}
        onClear={() => onTeamFilterChange(new Set())}
      />
      <CustomFacetedFilter
        title="Gen"
        options={genOptions}
        selectedValues={selectedGenIds}
        onValueSelect={handleGenSelect}
        onClear={() => onGenFilterChange(new Set())}
      />
    </div>
  );
}
