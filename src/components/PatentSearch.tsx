import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

interface PatentSearchProps {
  onPatentSelect: (patent: Patent) => void;
  onSearchResults: (results: Patent[], query: string) => void;
}

export default function PatentSearch({ onPatentSelect, onSearchResults }: PatentSearchProps) {
  const [query, setQuery] = useState("");
  const [patents, setPatents] = useState<Patent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/ask?input_text=${encodeURIComponent(query)}`);
      const data = await response.json();
      setPatents(data.response || []);
      onSearchResults(data.response || [], query);
      setSearched(true);
    } catch (error) {
      console.error("Search failed:", error);
      setPatents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-gradient-primary p-8 rounded-xl shadow-soft">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-foreground mb-4 text-center">
            Patent Search & Analytics
          </h1>
          <p className="text-primary-foreground/90 text-center mb-6">
            Search patents using keywords and analyze trends with interactive charts
          </p>
          
          {/* Search Input */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter keywords (e.g., 'curved mobile screen', 'android mobile')"
                className="pl-10 bg-card border-none shadow-sm"
                disabled={loading}
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={loading || !query.trim()}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Search Results ({patents.length})
            </h2>
          </div>

          {patents.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No patents found for your search query.</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {patents.map((patent) => (
                <Card 
                  key={patent.patent_id} 
                  className="p-6 hover:shadow-soft transition-shadow cursor-pointer border-l-4 border-l-primary"
                  onClick={() => onPatentSelect(patent)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-foreground line-clamp-2 flex-1">
                        {patent.title}
                      </h3>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {patent.date}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Patent ID: {patent.patent_id}</span>
                      <span>•</span>
                      <span>{patent.assignee}</span>
                      <span>•</span>
                      <span>{patent.domain}</span>
                    </div>
                    
                    <p className="text-sm text-foreground/80 line-clamp-3">
                      {patent.abstract}
                    </p>
                    
                    {patent.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {patent.technologies.slice(0, 3).map((tech, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                          >
                            {tech.split(':')[0]}
                          </span>
                        ))}
                        {patent.technologies.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{patent.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}