import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatentSearch from "@/components/PatentSearch";
import PatentDetails from "@/components/PatentDetails";
import PatentCharts from "@/components/PatentCharts";
import { Card, CardContent } from "@/components/ui/card";
import { FileSearch, BarChart3 } from "lucide-react";

interface Patent {
  abstract: string;
  assignee: string;
  assignee_country: string;
  attorney_org: string;
  company: string;
  cpc_group_id: string;
  date: string;
  domain: string;
  inventor_name: string;
  patent_id: string;
  patent_url: string;
  technologies: string[];
  title: string;
  type: string;
  use_cases: string[];
}

const Index = () => {
  const [selectedPatent, setSelectedPatent] = useState<Patent | null>(null);
  const [searchResults, setSearchResults] = useState<Patent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handlePatentSelect = (patent: Patent) => {
    setSelectedPatent(patent);
  };

  const handleSearchResults = (results: Patent[], query: string) => {
    setSearchResults(results);
    setSearchQuery(query);
    setSelectedPatent(null); // Clear selection when new search
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <FileSearch className="h-4 w-4" />
              Search & View
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Search Panel */}
              <div className="space-y-6">
                <PatentSearch 
                  onPatentSelect={handlePatentSelect}
                  onSearchResults={handleSearchResults}
                />
              </div>

              {/* Details Panel */}
              <div className="space-y-6">
                {selectedPatent ? (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <FileSearch className="h-5 w-5" />
                      Patent Details
                    </h2>
                    <PatentDetails patent={selectedPatent} />
                  </div>
                ) : (
                  <Card className="h-[400px]">
                    <CardContent className="h-full flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <FileSearch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Select a patent from the search results to view details</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <PatentCharts 
              searchResults={searchResults}
              searchQuery={searchQuery}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
