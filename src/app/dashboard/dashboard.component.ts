import { MatPaginator } from "@angular/material/paginator";
import { StadisticsService } from "./../services/stadistics.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import * as Chartist from "chartist";
import Swal from "sweetalert2";
import { BestCoordinators } from "app/models/bestCoordinator";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  public labels: string[] = [];
  public series: number[] = [];
  public alumns: string;
  public programs: string;
  public clients: string;
  public tours: string;
  public percentageDiff: number = 0;
  public dataLoaded = false;
  years: number[] = []; // Array para los años
  selectedYear: number;
  displayedColumns: string[] = [
    "cantidadHitos",
    "cantidadFotos",
    "tourSalesUuid",
    "tourSalesInit",
    "tourSalesFinal",
    "nameClient",
    "courseClient",
    "tourTripulationNameId",
  ];
  dataSource = new MatTableDataSource<BestCoordinators>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private girasService: StadisticsService) {}
  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on("draw", function (data) {
      if (data.type === "line" || data.type === "area") {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path
              .clone()
              .scale(1, 0)
              .translate(0, data.chartRect.height())
              .stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint,
          },
        });
      } else if (data.type === "point") {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: "ease",
          },
        });
      }
    });

    seq = 0;
  }
  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on("draw", function (data) {
      if (data.type === "bar") {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: "ease",
          },
        });
      }
    });

    seq2 = 0;
  }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.obtenerBestCoordinators(currentYear);
    this.obtenerRegistrosEstadisticos();

    // Crear un array con los próximos 10 años y los 10 anteriores
    for (let i = -5; i <= 5; i++) {
      this.years.push(currentYear + i);
    }

    // Establecer el año actual como valor por defecto
    this.selectedYear = currentYear;
  }

  onYearChange(): void {
    this.obtenerBestCoordinators(this.selectedYear);
  }

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  obtenerBestCoordinators(year: number) {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        if (this.selectedYear == null) {
          year = 2025;
        }
        console.log(year);
        this.girasService.bestCoordinator(year).subscribe((respon) => {
          this.dataSource = new MatTableDataSource(respon);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          Swal.close();
        });
      },
    });
  }

  obtenerRegistrosEstadisticos() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.girasService.listBuyYears().subscribe({
          next: (data: { [year: string]: number }) => {
            // Extraer labels y valores del objeto
            const labels = Object.keys(data); // Ejemplo: ["2024", "2025"]
            const values = Object.values(data); // Ejemplo: [72, 35]
            const maxValue = Math.max(...values);
            this.labels = Object.keys(data).sort(); // Orden ascendente por año
            this.series = this.labels.map((year) => data[year]);

            // Calcula el porcentaje entre los dos últimos años (si existen)
            if (this.labels.length >= 2) {
              const lastYear = this.labels[this.labels.length - 1];
              const prevYear = this.labels[this.labels.length - 2];
              const lastValue = data[lastYear];
              const prevValue = data[prevYear];
              if (prevValue > 0) {
                this.percentageDiff =
                  ((lastValue - prevValue) / prevValue) * 100;
              } else {
                this.percentageDiff = 0;
              }
            }

            // Configuración del gráfico
            const dataDailySalesChart: any = {
              labels: labels,
              series: [values],
            };

            const optionsDailySalesChart: any = {
              lineSmooth: Chartist.Interpolation.cardinal({ tension: 0 }),
              low: 0,
              // Opcional: agrega un margen al valor máximo
              high: maxValue + 20,
              chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
            };

            const dailySalesChart = new Chartist.Line(
              "#dailySalesChart",
              dataDailySalesChart,
              optionsDailySalesChart
            );
            this.startAnimationForLineChart(dailySalesChart);
          },
          error: (err) => {
            console.error("Error al cargar los datos:", err);
          },
        });

        const dataCompletedTasksChart: any = {
          labels: ["12p", "3p", "6p", "9p", "12p", "3a", "6a", "9a"],
          series: [[230, 750, 450, 300, 280, 240, 200, 190]],
        };

        const optionsCompletedTasksChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0,
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
        };

        var completedTasksChart = new Chartist.Line(
          "#completedTasksChart",
          dataCompletedTasksChart,
          optionsCompletedTasksChart
        );

        // start animation for the Completed Tasks Chart - Line Chart
        this.startAnimationForLineChart(completedTasksChart);

        this.girasService.countAlumns().subscribe({
          next: (result: string) => {
            this.alumns = result;
          },
          error: (err) => {
            console.error("Error al obtener el count:", err);
            this.alumns = "Error";
          },
        });
        this.girasService.countClient().subscribe({
          next: (result: string) => {
            this.clients = result;
          },
          error: (err) => {
            console.error("Error al obtener el count:", err);
            this.alumns = "Error";
          },
        });
        this.girasService.countProgram().subscribe({
          next: (result: string) => {
            this.programs = result;
          },
          error: (err) => {
            console.error("Error al obtener el count:", err);
            this.alumns = "Error";
          },
        });
        this.girasService.countTours().subscribe({
          next: (result: string) => {
            this.tours = result;
          },
          error: (err) => {
            console.error("Error al obtener el count:", err);
            this.alumns = "Error";
          },
        });

        /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

        this.girasService.listBuyYears().subscribe({
          next: (data: { [year: string]: number }) => {
            // Extraer labels y valores del objeto
            const labels = Object.keys(data); // Ejemplo: ["2024", "2025"]
            const values = Object.values(data); // Ejemplo: [72, 35]
            const maxValue = Math.max(...values); // Obtener el valor máximo para el rango del gráfico

            // Ordenar las etiquetas (años) en orden ascendente
            this.labels = labels.sort(); // Orden ascendente por año
            this.series = this.labels.map((year) => data[year]); // Asignar los valores a las series del gráfico

            // Configuración del gráfico
            const datawebsiteViewsChart: any = {
              labels: this.labels, // Años
              series: [this.series], // Valores de las compras por año
            };

            const optionswebsiteViewsChart: any = {
              axisX: {
                showGrid: false,
              },
              low: 0,
              high: maxValue + 20, // Ajusta el valor máximo para dar un poco de margen
              chartPadding: { top: 0, right: 5, bottom: 0, left: 0 },
            };

            const responsiveOptions: any[] = [
              [
                "screen and (max-width: 640px)",
                {
                  seriesBarDistance: 5,
                  axisX: {
                    labelInterpolationFnc: function (value) {
                      return value[0]; // Mostrar solo la primera letra del año si es necesario
                    },
                  },
                },
              ],
            ];

            // Crear el gráfico de barras
            const websiteViewsChart = new Chartist.Bar(
              "#websiteViewsChart",
              datawebsiteViewsChart,
              optionswebsiteViewsChart,
              responsiveOptions
            );

            // Iniciar animación para el gráfico
            this.startAnimationForBarChart(websiteViewsChart);
          },
          error: (err) => {
            console.error("Error al cargar los datos:", err);
          },
        });
      },
    });
  }
}
