import { AfterViewInit, Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexLegend,
  ApexFill,
  ApexResponsive,
  ApexNonAxisChartSeries,
} from "ng-apexcharts";
import { NgxSpinnerService } from "ngx-spinner";
import { NgxEchartsDirective, provideEcharts } from "ngx-echarts";
import { HttpClient } from "@angular/common/http";
import * as echarts from "echarts";
import { AuthService } from "app/authentication/auth.service";
import { BugsService } from "app/bugs/bugs.service";
import { RequirementsService } from "app/requirements/requirements.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  series2: ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
  labels: string[];
};
export type EChartsOption = {};
interface assStatus {
  assignee: string;
  open: string;
  closed: string;
  inprogress: string;
  uinvestigation: string;
  new: string;
  rreadyForTest: string;
  rwontFix: string;
  approvedByTestTeam: string;
  reopened: string;
}
interface moduleStatus {
  modules: string;
  open: string;
  closed: string;
  inprogress: string;
  uinvestigation: string;
  new: string;
  rreadyForTest: string;
  rwontFix: string;
  approvedByTestTeam: string;
  reopened: string;
}
interface mOwnerStatus {
  modules: string;
  // data: string;
  owners: { [key: string]: string };
}
@Component({
  selector: "app-dashboard2",
  templateUrl: "./dashboard2.component.html",
  styleUrls: ["./dashboard2.component.scss"],
  providers: [provideEcharts()],
})
export class Dashboard2Component implements OnInit, AfterViewInit {
  private chart: any;
  userName: string | null = null;
  assignWiseStatusHeader: any[] = [];
  assignWiseStatusData: any[] = [];

  moduleWiseOwnerStatusHeader: any[] = [];
  moduleWiseOwnerStatusData: any[] = [];

  moduleWiseStatusHeader: any[] = [];
  moduleWiseStatusData: any[] = [];

  assigneeHeader = [
    "Assignee",
    "Open",
    "Closed",
    "In progress",
    "Under Investigation",
    "New",
    "Resolved - ready for test",
    "Resolved - won't fix",
    "Approved by test team",
    "Re-opened",
  ];
  moduleOwnerHeader = [
    "Modules",
    "Kedharish R",
    "Iyyanar G",
    "Thirumalai RV",
    "Simeon V",
    "Tamil Vanan P",
    "Auvadaippan S",
    "Essaikipriya S",
    "Monika M",
    "Radhika R",
    "Padma Priya N",
  ];
  moduleStatusHeader = [
    "Modules",
    "Open",
    "Closed",
    "In progress",
    "Under Investigation",
    "New",
    "Resolved - ready for test",
    "Resolved - won't fix",
    "Approved by test team",
    "Re-opened",
  ];
  moduleOwnerStatus: mOwnerStatus[] = [
    {
      modules: "SAP 1",
      owners: {
        "Kedharish R": "5",
        "Iyyanar G": "7",
        "Thirumalai RV": "2",
        "Simeon V": "9",
        "Tamil Vanan P": "13",
        "Auvadaippan S": "1",
        "Essaikipriya S": "8",
        "Monika M": "2",
        "Radhika R": "6",
        "Padma Priya N": "17",
      },
    },
    {
      modules: "SAP 2",
      owners: {
        "Kedharish R": "15",
        "Iyyanar G": "17",
        "Thirumalai RV": "12",
        "Simeon V": "10",
        "Tamil Vanan P": "3",
        "Auvadaippan S": "13",
        "Essaikipriya S": "9",
        "Monika M": "2",
        "Radhika R": "7",
        "Padma Priya N": "5",
      },
    },
  ];
  assigneeStatus: assStatus[] = [
    {
      assignee: "Kedharish R",
      open: "0",
      closed: "8",
      inprogress: "0",
      uinvestigation: "0",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
    {
      assignee: "Iyyanar G",
      open: "15",
      closed: "7",
      inprogress: "2",
      uinvestigation: "10",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
    {
      assignee: "Thirumalai RV",
      open: "5",
      closed: "3",
      inprogress: "2",
      uinvestigation: "12",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
    {
      assignee: "Simeon V",
      open: "0",
      closed: "13",
      inprogress: "0",
      uinvestigation: "0",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
    {
      assignee: "Tamil Vanan P",
      open: "2",
      closed: "9",
      inprogress: "0",
      uinvestigation: "1",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
    {
      assignee: "Auvadaippan S",
      open: "0",
      closed: "15",
      inprogress: "0",
      uinvestigation: "17",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
    {
      assignee: "Essaikipriya S",
      open: "3",
      closed: "5",
      inprogress: "3",
      uinvestigation: "4",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
    {
      assignee: "Monika M",
      open: "21",
      closed: "6",
      inprogress: "9",
      uinvestigation: "14",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
    {
      assignee: "Radhika R",
      open: "5",
      closed: "6",
      inprogress: "7",
      uinvestigation: "8",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
    {
      assignee: "Padma Priya N",
      open: "0",
      closed: "14",
      inprogress: "0",
      uinvestigation: "2",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
  ];
  moduleStatus: moduleStatus[] = [
    {
      modules: "SAP 1",
      open: "0",
      closed: "8",
      inprogress: "0",
      uinvestigation: "0",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
    {
      modules: "SAP 2",
      open: "15",
      closed: "7",
      inprogress: "2",
      uinvestigation: "10",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
    {
      modules: "SAP 3",
      open: "5",
      closed: "3",
      inprogress: "2",
      uinvestigation: "12",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
    {
      modules: "SAP 4",
      open: "0",
      closed: "13",
      inprogress: "0",
      uinvestigation: "0",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
    {
      modules: "SAP 5",
      open: "2",
      closed: "9",
      inprogress: "0",
      uinvestigation: "1",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
    {
      modules: "SAP 6",
      open: "0",
      closed: "15",
      inprogress: "0",
      uinvestigation: "17",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
    {
      modules: "SAP 7",
      open: "3",
      closed: "5",
      inprogress: "3",
      uinvestigation: "4",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
    {
      modules: "SAP 8",
      open: "21",
      closed: "6",
      inprogress: "9",
      uinvestigation: "14",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
    {
      modules: "SAP 9",
      open: "5",
      closed: "6",
      inprogress: "7",
      uinvestigation: "8",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
    {
      modules: "SAP 10",
      open: "0",
      closed: "14",
      inprogress: "0",
      uinvestigation: "2",
      new: "10",
      rreadyForTest: "5",
      rwontFix: "7",
      approvedByTestTeam: "8",
      reopened: "6",
    },
  ];

  // Explicitly define the type for series
  bugStatusChartOption: any = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "5%",
      left: "center",
    },
    series: [
      {
        name: "Status Wise Bugs",
        type: "pie",
        radius: ["40%", "75%"],
        center: ["45%", "50%"],
        startAngle: 180,
        endAngle: 360,
        data: [], // Initialize with empty data
      },
    ] as any, // Explicitly casting the series as any to prevent type errors
  };
  // bugData = [
  //   { value: 1048, name: 'New' },
  //   { value: 735, name: 'Under Investigation' },
  //   { value: 580, name: 'In progress' },
  //   { value: 484, name: 'Resolved - ready for test' },
  //   { value: 300, name: 'Resolved - wont fix' },
  //   { value: 200, name: 'Approved by test team' },
  //   { value: 182, name: 'Re-opened' },
  //   { value: 100, name: 'Open' },
  //   { value: 50, name: 'Closed' }
  // ];
  bugData: any[] = [];
  reqData: any[] = [];
  assigneeStatusChartOption: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params: any) {
        let tar;
        if (params[1] && params[1].value !== "-") {
          tar = params[1];
        } else {
          tar = params[2];
        }
        return tar && tar.name + "<br/>" + tar.seriesName + " : " + tar.value;
      },
    },
    legend: {
      data: ["Expenses", "Income"],
      bottom: "0%",
      left: "center",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "13%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: (function () {
        let list = [];
        for (let i = 1; i <= 11; i++) {
          list.push("Nov " + i);
        }
        return list;
      })(),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Placeholder",
        type: "bar",
        stack: "Total",
        silent: true,
        itemStyle: {
          borderColor: "transparent",
          color: "transparent",
        },
        emphasis: {
          itemStyle: {
            borderColor: "transparent",
            color: "transparent",
          },
        },
        data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292],
      },
      {
        name: "Income",
        type: "bar",
        stack: "Total",
        label: {
          show: true,
          position: "top",
        },
        data: [900, 345, 393, "-", "-", 135, 178, 286, "-", "-", "-"],
      },
      {
        name: "Expenses",
        type: "bar",
        stack: "Total",
        label: {
          show: true,
          position: "bottom",
        },
        data: ["-", "-", "-", 108, 154, "-", "-", "-", 119, 361, 203],
      },
    ],
  };
  ageingChartOption: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      bottom: "5%",
      left: "center",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category", // Changed from 'value' to 'category'
      data: ["2", "5", "7", "9", "1", "10", "3"], // Count
    },
    yAxis: {
      type: "value",
      min: 0, // Start from 0
      max: 10, // Adjust this value to your desired maximum
      interval: 1, // Interval of 1 between ticks
      axisLabel: {
        formatter: "{value}", // Customize label format if needed
      },
    },
    series: [
      {
        name: "Low",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: [3, 2, 1, 4, 3, 2, 3],
        itemStyle: {
          color: "#90EE90",
        },
      },
      {
        name: "Medium",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: [1, 1, 2, 1, 0, 2, 2],
        itemStyle: {
          color: "#FFA500",
        },
      },
      {
        name: "Critical",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: [2, 1, 1, 2, 3, 3, 3],
        itemStyle: {
          color: "#FF0000",
        },
      },
    ],
  };
  ownerStatusChartOption: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      bottom: "0%", // Adjust legend position if needed
    },
    grid: {
      left: "12%", // Adjust to give more space for the y-axis label
      right: "4%",
      bottom: "15%", // Adjust to give more space for the x-axis label
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["Kedhar", "Iyyanar", "Thirumalai"],
      name: "Owner", // Display text for x-axis
      nameLocation: "center", // Position the name in the center of the x-axis
      nameTextStyle: {
        fontWeight: "bold",
        fontSize: 14,
      },
      nameGap: 30, // Adjust this to move the label between the x-axis and legend
    },
    yAxis: {
      type: "value",
      name: "Count", // Display text for y-axis
      nameLocation: "middle", // Position the name in the middle of the y-axis
      nameTextStyle: {
        fontWeight: "bold",
        fontSize: 14,
      },
      nameGap: 50, // Adjust this to move the label to the left
      axisLabel: {
        formatter: "{value}",
      },
    },
    series: [
      {
        name: "Open",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: [10, 20, 5], // Random numbers for 'Open'
      },
      {
        name: "Closed",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: [2, 7, 24], // Random numbers for 'Closed'
      },
      {
        name: "In progress",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: [15, 8, 13], // Random numbers for 'In progress'
      },
    ],
  };
  tcaseStatusChartOption: EChartsOption = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "5%",
      left: "center",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["45%", "40%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
          formatter: "{b} {c}",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: true,
        },
        data: [
          {
            value: 100,
            itemStyle: {
              color: "#0000FF", // Blue
            },
            name: "Awaiting",
          },
          {
            value: 70,
            itemStyle: {
              color: "#90EE90", // Light Green
            },
            name: "Pass",
          },
          {
            value: 50,
            itemStyle: {
              color: "#FF0000", // Red
            },
            name: "Fail",
          },
          {
            value: 40,
            itemStyle: {
              color: "#808080", // Grey
            },
            name: "N/A",
          },
          {
            value: 30,
            itemStyle: {
              color: "#FFA500", // Orange
            },
            name: "On hold",
          },
        ],
      },
    ],
  };
  bugsByModuleChartOption: any = {
    title: {
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "5%",
      left: "center",
    },
    series: [
      {
        name: "Bugs By Module",
        type: "pie",
        radius: "50%",
        center: ["50%", "40%"],
        data: [], // Initialize with empty data
      },
    ] as any, // Explicitly casting the series as any to prevent type errors
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: "rgba(0, 0, 0, 0.5)",
      },
    },
  };
  reqByModuleChartOption: any = {
    title: {
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "5%",
      left: "center",
    },
    series: [
      {
        name: "Requirements By Module",
        type: "pie",
        radius: "50%",
        center: ["50%", "40%"],
        data: [], // Initialize with empty data
      },
    ] as any, // Explicitly casting the series as any to prevent type errors
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: "rgba(0, 0, 0, 0.5)",
      },
    },
  };
  greeting: string = "";
  icon: string = "";
  currentDate: Date = new Date();
  typeSelected!: string;
  issues = [
    { count: 1, label: "Total O/S Bugs" },
    { count: 27, label: "Total Bugs" },
    { count: 15, label: "Total Requirements" },
    { count: 40, label: "Test Execution %" },
  ];
  selectedBugStatusDay = 1; // Default to 'All time'
  selectedBugModuleDay = 1; // Default to 'All time'
  selectedReqModuleDay = 1; // Default to 'All time'
  selectBugStatusDay = [
    { id: 1, value: "All time" },
    { id: 2, value: "Due today" },
    { id: 3, value: "Due this week" },
    { id: 4, value: "Due this month" },
    { id: 5, value: "Due this year" },
    // { id: 6, value: "Custom Range" },
  ];
  selectBugModuleDay = [
    { id: 1, value: "All time" },
    { id: 2, value: "Due today" },
    { id: 3, value: "Due this week" },
    { id: 4, value: "Due this month" },
    { id: 5, value: "Due this year" },
    // { id: 6, value: "Custom Range" },
  ];
  selectReqModuleDay = [
    { id: 1, value: "All time" },
    { id: 2, value: "Due today" },
    { id: 3, value: "Due this week" },
    { id: 4, value: "Due this month" },
    { id: 5, value: "Due this year" },
    // { id: 6, value: "Custom Range" },
  ];

  public pieChartOptions!: Partial<ChartOptions>;
  constructor(
    private translateService: TranslateService,
    private http: HttpClient,
    private authService: AuthService,
    public advanceTableService: BugsService,
    public reqService: RequirementsService
  ) {
    //constructor
    this.typeSelected = "ball-fussion";
    // this.updateBugStatusChartData();
  }
  getTranslation(key: string): string {
    return this.translateService.instant(key);
  }

  ngOnInit() {
    this.authService.currentUserName$.subscribe((uname) => {
      this.userName = uname;
    });

    this.updateGreeting();
    setInterval(() => {
      this.currentDate = new Date();
      this.updateGreeting();
    }, 300); // Update every second
  }
  //tree chart below ngAfterViewInit
  ngAfterViewInit(): void {
    this.fetchBugData(); // Bugs
    this.fetchReqData(); // Requirements
    this.updateBugStatusChartData();
    this.updateBugModuleChartData();
    this.updateReqModuleChartData();
    const chartDom = document.getElementById("main")!;
    this.chart = echarts.init(chartDom);
    this.chart.showLoading();

    // Fetch data using Angular HttpClient
    this.http.get("assets/data/tree-chart.json").subscribe((data: any) => {
      this.chart.hideLoading();

      // Collapse nodes on even indices
      data.children.forEach((datum: { collapsed: boolean }, index: number) => {
        if (index % 2 === 0) {
          datum.collapsed = true;
        }
      });

      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
        },
        series: [
          {
            type: "tree",
            data: [data],
            top: "1%",
            left: "7%",
            bottom: "15%",
            right: "20%",
            symbolSize: 7,
            label: {
              position: "left",
              verticalAlign: "middle",
              align: "right",
              fontSize: 9,
            },
            leaves: {
              label: {
                position: "right",
                verticalAlign: "middle",
                align: "left",
              },
            },
            emphasis: {
              focus: "descendant",
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
          },
        ],
      };

      this.chart.setOption(option);
    });
  }
  // Fetch bug data from the API
  fetchBugData(): void {
    this.advanceTableService.getBugDashboard().subscribe({
      next: (data) => {
        this.bugData = data; // Store the data
        console.log(this.bugData);

        // Step 1: Get unique statuses from the bug data
        const uniqueStatuses = Array.from(
          new Set(this.bugData.map((item: any) => item.status))
        );

        // Step 2: Set the dynamic header (assignee and statuses)
        this.assignWiseStatusHeader = ["Assignee", ...uniqueStatuses]; // The first column will be 'Assignee', followed by statuses

        // Step 1: Get unique statuses from the bug data
        const mwOwnerStatus = Array.from(
          new Set(this.bugData.map((item: any) => item.assignee))
        );

        // Step 2: Set the dynamic header (assignee and statuses)
        this.moduleWiseOwnerStatusHeader = ["Modules", ...mwOwnerStatus];

        // Step 1: Get unique statuses from the bug data
        const mwStatus = Array.from(
          new Set(this.bugData.map((item: any) => item.status))
        );

        // Step 2: Set the dynamic header (assignee and statuses)
        this.moduleWiseStatusHeader = ["Modules", ...mwStatus];

        // Step 3: Group bugs by assignee and count the number of bugs per status
        const assigneeMap = new Map();
        const ownerMap = new Map();
        const moduleWiseStatusMap = new Map();

        this.bugData.forEach((bug: any) => {
          const assigneeStatus = bug.assignee;
          const status = bug.status;

          console.log(assigneeStatus);
          console.log(status);

          if (!assigneeMap.has(assigneeStatus)) {
            // Initialize an entry for the assignee with all status counts set to 0
            assigneeMap.set(assigneeStatus, {
              assignee: assigneeStatus,
              ...Object.fromEntries(
                uniqueStatuses.map((status) => [status, 0])
              ), // Set all statuses to 0 initially
            });
          }

          // Increment the count for the current status
          assigneeMap.get(assigneeStatus)[status]++;

          const moduleName = bug.mname; // The module name
          const assignee = bug.assignee; // The assignee of the bug

          // If the module isn't in the map yet, initialize it
          if (!ownerMap.has(moduleName)) {
            // Initialize an entry for the module with all assignee counts set to 0
            ownerMap.set(moduleName, {
              mname: moduleName,
              ...Object.fromEntries(
                mwOwnerStatus.map((assignee) => [assignee, 0])
              ), // Set all assignees to 0 initially
            });
          }

          // Increment the count for the current assignee
          ownerMap.get(moduleName)[assignee]++;

          const moduleNames = bug.mname;
          const bstatus = bug.status;

          console.log(moduleNames);
          console.log(bstatus);

          if (!moduleWiseStatusMap.has(moduleNames)) {
            // Initialize an entry for the assignee with all status counts set to 0
            moduleWiseStatusMap.set(moduleNames, {
              mname: moduleNames,
              ...Object.fromEntries(
                uniqueStatuses.map((status) => [status, 0])
              ), // Set all statuses to 0 initially
            });
          }

          // Increment the count for the current status
          moduleWiseStatusMap.get(moduleNames)[status]++;
        });

        // Step 4: Convert the assigneeMap to an array for the table display
        this.assignWiseStatusData = Array.from(assigneeMap.values());

        console.log(
          "Assignee Data with Status Counts:",
          this.assignWiseStatusData
        );

        // Step 4: Convert the ownerMap to an array for the table display
        this.moduleWiseOwnerStatusData = Array.from(ownerMap.values());

        console.log(
          "Module Wise Owner Status Data with Status Counts:",
          this.moduleWiseOwnerStatusData
        );

        this.moduleWiseStatusData = Array.from(moduleWiseStatusMap.values());

        console.log(
          "Assignee Data with Status Counts:",
          this.moduleWiseStatusData
        );

        const bugOpenStatus = this.bugData.map((item: any) => item.status);
        console.log(bugOpenStatus);
        const bugOpenStatusCount = this.bugData.filter(
          (item: any) => item.status === "Open"
        ).length;
        console.log(bugOpenStatusCount);
        // Update the "Total Requirements" count in the issues array
        const totalBugIndex = this.issues.findIndex(
          (issue) => issue.label === "Total Bugs"
        );

        if (totalBugIndex !== -1) {
          this.issues[totalBugIndex].count = this.bugData.length;
        }

        // Update the "Total O/S Bugs" count in the issues array for Open bugs
        const osBugIndex = this.issues.findIndex(
          (issue) => issue.label === "Total O/S Bugs"
        );
        if (osBugIndex !== -1) {
          this.issues[osBugIndex].count = bugOpenStatusCount;
        }

        this.updateBugStatusChartData(); // Update the chart after fetching data
        this.updateBugModuleChartData();
      },
      error: (err) => {
        console.error("Error fetching bug data", err);
      },
    });
  }
  // fetchReqData(): void {
  //   this.reqService.getReqDashboard().subscribe({
  //     next: (data) => {
  //       this.reqData = data; // Store the data
  //       console.log(this.reqData.length);
  //     },
  //     error: (err) => {
  //       console.error('Error fetching req data', err);
  //     }
  //   });
  // }

  fetchReqData(): void {
    this.reqService.getReqDashboard().subscribe({
      next: (data) => {
        this.reqData = data; // Store the fetched data
        console.log(this.reqData.length);

        // Update the "Total Requirements" count in the issues array
        const totalReqIndex = this.issues.findIndex(
          (issue) => issue.label === "Total Requirements"
        );

        if (totalReqIndex !== -1) {
          this.issues[totalReqIndex].count = this.reqData.length;
        }
        this.updateReqModuleChartData();
      },
      error: (err) => {
        console.error("Error fetching req data", err);
      },
    });
  }
  onBugStatusDayChange(selectedId: any): void {
    this.selectedBugStatusDay = Number(selectedId); // Convert selectedId to a number
    console.log("Selected Bug Status Day:", this.selectedBugStatusDay); // Log selected day
    this.updateBugStatusChartData();
  }
  onBugModuleDayChange(selectedId: any): void {
    this.selectedBugModuleDay = Number(selectedId); // Convert selectedId to a number
    console.log("Selected Bug Module Day:", this.selectedBugModuleDay); // Log selected day
    this.updateBugModuleChartData();
  }
  onReqModuleDayChange(selectedId: any): void {
    this.selectedReqModuleDay = Number(selectedId); // Convert selectedId to a number
    console.log("Selected Requirements Module Day:", this.selectedReqModuleDay); // Log selected day
    this.updateReqModuleChartData();
  }

  // updateBugStatusChartData(): void {
  //   console.log(this.selectedBugStatusDay);
  //   const filteredData = this.filterBugByTime(this.selectedBugStatusDay);
  //   console.log(this.selectedBugStatusDay);
  //   console.log(filteredData);
  //   const options = this.bugStatusChartOption as any; // Using 'as any' to bypass TypeScript's strict type checking
  //  console.log(options);
  //   if (options.series && options.series[0]) {
  //     options.series[0].data = filteredData;
  //   }
  // }

  // updateBugStatusChartData(): void {
  //   const filteredData = this.filterBugByTime(this.selectedBugStatusDay);
  //   this.bugStatusChartOption = { // Reassign the chart option to trigger change detection
  //     ...this.bugStatusChartOption,
  //     series: [
  //       {
  //         ...this.bugStatusChartOption.series[0],
  //         data: filteredData,
  //       }
  //     ]
  //   };
  // }

  // Update the chart with filtered and grouped data
  updateBugStatusChartData(): void {
    const filteredData = this.filterBugStatusByTime(this.selectedBugStatusDay);
    const groupedData = this.groupBugStatus(filteredData);

    this.bugStatusChartOption = {
      ...this.bugStatusChartOption,
      series: [
        {
          ...this.bugStatusChartOption.series[0],
          data: groupedData, // Update the chart data with grouped data
        },
      ],
    };
  }
  updateBugModuleChartData(): void {
    const filteredData = this.filterBugModuleByTime(this.selectedBugModuleDay);
    const groupedData = this.groupBugModule(filteredData);

    this.bugsByModuleChartOption = {
      ...this.bugsByModuleChartOption,
      series: [
        {
          ...this.bugsByModuleChartOption.series[0],
          data: groupedData, // Update the chart data with grouped data
        },
      ],
    };
  }
  updateReqModuleChartData(): void {
    const filteredData = this.filterReqModuleByTime(this.selectedReqModuleDay);
    const groupedData = this.groupReqModule(filteredData);

    this.reqByModuleChartOption = {
      ...this.reqByModuleChartOption,
      series: [
        {
          ...this.reqByModuleChartOption.series[0],
          data: groupedData, // Update the chart data with grouped data
        },
      ],
    };
  }
  bugStatusStartDate: Date | null = null;
  bugStatusEndDate: Date | null = null;
  bugModuleStartDate: Date | null = null;
  bugModuleEndDate: Date | null = null;
  reqModuleStartDate: Date | null = null;
  reqModuleEndDate: Date | null = null;
  applyBugStatusDateRange(): void {
    console.log(this.bugStatusStartDate);
    console.log(this.bugStatusEndDate);
    if (this.bugStatusStartDate && this.bugStatusEndDate) {
      this.selectedBugStatusDay = 6; // Set to custom range
      this.updateBugStatusChartData(); // Update chart with the new range
    }
  }
  applyBugModuleDateRange(): void {
    console.log(this.bugModuleStartDate);
    console.log(this.bugModuleEndDate);
    if (this.bugModuleStartDate && this.bugModuleEndDate) {
      this.selectedBugModuleDay = 6; // Set to custom range
      this.updateBugModuleChartData(); // Update chart with the new range
    }
  }
  applyReqModuleDateRange(): void {
    console.log(this.reqModuleStartDate);
    console.log(this.reqModuleEndDate);
    if (this.reqModuleStartDate && this.reqModuleEndDate) {
      this.selectedReqModuleDay = 6; // Set to custom range
      this.updateReqModuleChartData(); // Update chart with the new range
    }
  }

  filterBugStatusByTime(dayId: any): any[] {
    const numericDayId = Number(dayId);
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in 'YYYY-MM-DD' format

    switch (numericDayId) {
      case 1: // All Time
        return this.bugData;

      case 2: // Due Today
        return this.bugData.filter(
          (item) =>
            item.startdate === currentDate || item.enddate === currentDate
        );

      case 3: // Due This Week
        const startOfWeek = this.getStartOfWeek(new Date());
        const endOfWeek = this.getEndOfWeek(new Date());
        return this.bugData.filter(
          (item) =>
            new Date(item.startdate) >= startOfWeek &&
            new Date(item.enddate) <= endOfWeek
        );

      case 4: // Due This Month
        const startOfMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        );
        const endOfMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        );
        return this.bugData.filter(
          (item) =>
            new Date(item.startdate) >= startOfMonth &&
            new Date(item.enddate) <= endOfMonth
        );

      case 5: // Due This Year
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear(), 11, 31);
        return this.bugData.filter(
          (item) =>
            new Date(item.startdate) >= startOfYear &&
            new Date(item.enddate) <= endOfYear
        );

      // case 6: // Custom Range (implement your own custom range logic)
      //   return this.bugData.filter(item =>
      //     item.filtertype === "customRange"
      //   );
      case 6: // Custom Range
        if (this.bugStatusStartDate && this.bugStatusEndDate) {
          return this.bugData.filter((item) => {
            const itemStartDate = new Date(item.startdate);
            const itemEndDate = new Date(item.enddate);
            return (
              itemStartDate >= this.bugStatusStartDate! && // Use non-null assertion
              itemEndDate <= this.bugStatusEndDate! // Use non-null assertion

              // itemStartDate <= this.bugStatusEndDate! &&
              // itemEndDate >= this.bugStatusStartDate!
            );
          });
        }
        return []; // Return an empty array if dates are not set

      default:
        return this.bugData;
    }
  }
  filterBugModuleByTime(dayId: any): any[] {
    const numericDayId = Number(dayId);
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in 'YYYY-MM-DD' format

    switch (numericDayId) {
      case 1: // All Time
        return this.bugData;

      case 2: // Due Today
        return this.bugData.filter(
          (item) =>
            item.startdate === currentDate || item.enddate === currentDate
        );

      case 3: // Due This Week
        const startOfWeek = this.getStartOfWeek(new Date());
        const endOfWeek = this.getEndOfWeek(new Date());
        return this.bugData.filter(
          (item) =>
            new Date(item.startdate) >= startOfWeek &&
            new Date(item.enddate) <= endOfWeek
        );

      case 4: // Due This Month
        const startOfMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        );
        const endOfMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        );
        return this.bugData.filter(
          (item) =>
            new Date(item.startdate) >= startOfMonth &&
            new Date(item.enddate) <= endOfMonth
        );

      case 5: // Due This Year
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear(), 11, 31);
        return this.bugData.filter(
          (item) =>
            new Date(item.startdate) >= startOfYear &&
            new Date(item.enddate) <= endOfYear
        );

      // case 6: // Custom Range (implement your own custom range logic)
      //   return this.bugData.filter(item =>
      //     item.filtertype === "customRange"
      //   );
      case 6: // Custom Range
        if (this.bugModuleStartDate && this.bugModuleEndDate) {
          return this.bugData.filter((item) => {
            const itemStartDate = new Date(item.startdate);
            const itemEndDate = new Date(item.enddate);
            return (
              itemStartDate >= this.bugModuleStartDate! && // Use non-null assertion
              itemEndDate <= this.bugModuleEndDate! // Use non-null assertion

              // itemStartDate <= this.bugModuleEndDate! &&
              // itemEndDate >= this.bugModuleStartDate!
            );
          });
        }
        return []; // Return an empty array if dates are not set

      default:
        return this.bugData;
    }
  }
  filterReqModuleByTime(dayId: any): any[] {
    const numericDayId = Number(dayId);
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in 'YYYY-MM-DD' format

    switch (numericDayId) {
      case 1: // All Time
        return this.reqData;

      case 2: // Due Today
        return this.reqData.filter(
          (item) =>
            item.startdate === currentDate || item.enddate === currentDate
        );

      case 3: // Due This Week
        const startOfWeek = this.getStartOfWeek(new Date());
        const endOfWeek = this.getEndOfWeek(new Date());
        return this.reqData.filter(
          (item) =>
            new Date(item.startdate) >= startOfWeek &&
            new Date(item.enddate) <= endOfWeek
        );

      case 4: // Due This Month
        const startOfMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        );
        const endOfMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        );
        return this.reqData.filter(
          (item) =>
            new Date(item.startdate) >= startOfMonth &&
            new Date(item.enddate) <= endOfMonth
        );

      case 5: // Due This Year
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear(), 11, 31);
        return this.reqData.filter(
          (item) =>
            new Date(item.startdate) >= startOfYear &&
            new Date(item.enddate) <= endOfYear
        );

      // case 6: // Custom Range (implement your own custom range logic)
      //   return this.reqData.filter(item =>
      //     item.filtertype === "customRange"
      //   );
      case 6: // Custom Range
        if (this.reqModuleStartDate && this.reqModuleEndDate) {
          return this.reqData.filter((item) => {
            const itemStartDate = new Date(item.startdate);
            const itemEndDate = new Date(item.enddate);
            return (
              itemStartDate >= this.reqModuleStartDate! && // Use non-null assertion
              itemEndDate <= this.reqModuleEndDate! // Use non-null assertion

              // itemStartDate <= this.reqModuleEndDate! &&
              // itemEndDate >= this.reqModuleStartDate!
            );
          });
        }
        return []; // Return an empty array if dates are not set

      default:
        return this.reqData;
    }
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  }

  getEndOfWeek(date: Date): Date {
    const startOfWeek = this.getStartOfWeek(date);
    return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
  }

  // Group bugs by status and prepare data for the chart
  groupBugStatus(filteredData: any[]): any[] {
    const statusMap = new Map<string, number>();

    // Count the number of bugs per status
    filteredData.forEach((bug) => {
      const status = bug.status;
      if (statusMap.has(status)) {
        statusMap.set(status, statusMap.get(status)! + 1);
      } else {
        statusMap.set(status, 1);
      }
    });

    // Transform the map into an array of objects for the chart
    const chartData = Array.from(statusMap, ([name, value]) => ({
      name,
      value,
    }));
    return chartData;
  }
  groupBugModule(filteredData: any[]): any[] {
    const mnameMap = new Map<string, number>();

    // Count the number of bugs per mname
    filteredData.forEach((bug) => {
      const mname = bug.mname;
      if (mnameMap.has(mname)) {
        mnameMap.set(mname, mnameMap.get(mname)! + 1);
      } else {
        mnameMap.set(mname, 1);
      }
    });

    // Transform the map into an array of objects for the chart
    const chartData = Array.from(mnameMap, ([name, value]) => ({
      name,
      value,
    }));
    return chartData;
  }
  groupReqModule(filteredData: any[]): any[] {
    const mnameMap = new Map<string, number>();

    // Count the number of bugs per mname
    filteredData.forEach((req) => {
      const mname = req.mname;
      if (mnameMap.has(mname)) {
        mnameMap.set(mname, mnameMap.get(mname)! + 1);
      } else {
        mnameMap.set(mname, 1);
      }
    });

    // Transform the map into an array of objects for the chart
    const chartData = Array.from(mnameMap, ([name, value]) => ({
      name,
      value,
    }));
    return chartData;
  }
  updateGreeting() {
    const hour = this.currentDate.getHours();
    if (hour < 12) {
      this.greeting = "Good Morning";
      this.icon = "🌥️"; // Morning icon (cloudy day, you can change it)
    } else if (hour < 18) {
      this.greeting = "Good Afternoon";
      this.icon = "☀️"; // Afternoon icon (sun)
    } else if (hour < 21) {
      this.greeting = "Good Evening";
      this.icon = "🌅"; // Evening icon (sunset)
    } else {
      this.greeting = "Good Night";
      this.icon = "🌙"; // Night icon (moon)
    }
  }
}
