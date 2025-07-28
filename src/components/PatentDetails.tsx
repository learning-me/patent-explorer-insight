import { ExternalLink, Calendar, Building, User, Globe, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface PatentDetailsProps {
  patent: Patent;
}

export default function PatentDetails({ patent }: PatentDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{patent.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {patent.patent_id}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {patent.date}
                </span>
                <Badge variant="secondary">{patent.type}</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={patent.patent_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Patent
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 leading-relaxed">{patent.abstract}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Company & Legal Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building className="h-5 w-5" />
              Company & Legal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Assignee</label>
              <p className="text-foreground">{patent.assignee}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Company</label>
              <p className="text-foreground">{patent.company}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Country</label>
              <p className="text-foreground flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {patent.assignee_country}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Attorney Organization</label>
              <p className="text-foreground">{patent.attorney_org}</p>
            </div>
          </CardContent>
        </Card>

        {/* Technical Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Technical Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Inventor</label>
              <p className="text-foreground">{patent.inventor_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Domain</label>
              <Badge variant="outline">{patent.domain}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">CPC Group ID</label>
              <p className="text-foreground font-mono">{patent.cpc_group_id}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technologies */}
      <Card>
        <CardHeader>
          <CardTitle>Technologies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patent.technologies.map((tech, index) => {
              const [name, description] = tech.split(': ');
              return (
                <div key={index} className="border-l-2 border-accent pl-4">
                  <h4 className="font-medium text-foreground">{name}</h4>
                  {description && (
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Use Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patent.use_cases.map((useCase, index) => {
              const [title, description] = useCase.split(': ');
              return (
                <div key={index} className="border-l-2 border-primary pl-4">
                  <h4 className="font-medium text-foreground">{title}</h4>
                  {description && (
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}