import { useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Download, Calendar, TrendingUp, Loader2, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import html2canvas from "html2canvas";

interface YearData {
  year: number;
  count: number;
}

interface Patent {
  assignee: string;
  date: string;
  domain: string;
  [key: string]: any;
}

interface PatentChartsProps {
  searchResults: Patent[];
  searchQuery: string;
}

const COLORS = ['#0ea5e9', '#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#6366f1', '#ec4899'];

export default function PatentCharts({ searchResults, searchQuery }: PatentChartsProps) {
  const [yearwiseData, setYearwiseData] = useState<YearData[]>([]);
  const [loading, setLoading] = useState(false);
  const [yearsInput, setYearsInput] = useState("5");
  const [chartType, setChartType] = useState("bar");
  const chartsRef = useRef<HTMLDivElement>(null);

  const fetchYearwiseData = async () => {
    if (!searchQuery) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/yearwise_count?no_of_years=${yearsInput}&keyword=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setYearwiseData(data.sort((a: YearData, b: YearData) => a.year - b.year));
    } catch (error) {
      console.error("Failed to fetch year-wise data:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCharts = async () => {
    if (!chartsRef.current) return;
    
    try {
      const canvas = await html2canvas(chartsRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `patent-analytics-${searchQuery}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Failed to download charts:", error);
    }
  };

  // Process search results for additional charts
  const domainData = searchResults.reduce((acc, patent) => {
    const domain = patent.domain || 'Unknown';
    acc[domain] = (acc[domain] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const domainChartData = Object.entries(domainData).map(([domain, count]) => ({
    domain,
    count,
  }));

  const assigneeData = searchResults.reduce((acc, patent) => {
    const assignee = patent.assignee || 'Unknown';
    acc[assignee] = (acc[assignee] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const assigneeChartData = Object.entries(assigneeData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([assignee, count]) => ({
      assignee: assignee.length > 20 ? assignee.substring(0, 20) + '...' : assignee,
      count,
    }));

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="years">Number of Years</Label>
              <Input
                id="years"
                type="number"
                value={yearsInput}
                onChange={(e) => setYearsInput(e.target.value)}
                min="1"
                max="20"
                className="w-24"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="chart-type">Chart Type</Label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={fetchYearwiseData} 
              disabled={loading || !searchQuery}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <TrendingUp className="h-4 w-4 mr-2" />
              )}
              Generate Charts
            </Button>

            <Button 
              onClick={downloadCharts} 
              variant="outline"
              disabled={yearwiseData.length === 0 && searchResults.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>

          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-4">
              Analyzing data for: <span className="font-medium">"{searchQuery}"</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Charts Container */}
      <div ref={chartsRef} className="space-y-6 bg-white p-6 rounded-lg">
        {/* Year-wise Patent Count */}
        {yearwiseData.length > 0 && (
          <Card className="shadow-chart">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Year-wise Patent Count ({yearwiseData.length} years)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "bar" ? (
                    <BarChart data={yearwiseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [value, 'Patents']}
                        labelFormatter={(label) => `Year: ${label}`}
                      />
                      <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : chartType === "line" ? (
                    <LineChart data={yearwiseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [value, 'Patents']}
                        labelFormatter={(label) => `Year: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#0ea5e9" 
                        strokeWidth={3}
                        dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={yearwiseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ year, count, percent }) => `${year}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {yearwiseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Patents']} />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {searchResults.length > 0 && (
          <>
            {/* Domain Distribution */}
            {domainChartData.length > 0 && (
              <Card className="shadow-chart">
                <CardHeader>
                  <CardTitle>Patents by Domain</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={domainChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ domain, percent }) => `${domain}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {domainChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Patents']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Assignees */}
            {assigneeChartData.length > 0 && (
              <Card className="shadow-chart">
                <CardHeader>
                  <CardTitle>Top Patent Assignees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={assigneeChartData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="assignee" width={150} />
                        <Tooltip formatter={(value) => [value, 'Patents']} />
                        <Bar dataKey="count" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {yearwiseData.length === 0 && searchResults.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Search for patents and generate charts to see analytics data
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}