import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const ProgressChart = ({
  type = "bar", // 'bar', 'line', 'pie'
  data,
  title,
  height = 200,
  showLegend = true,
}) => {
  // Configuração comum para os gráficos
  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#4A90E2",
    },
    propsForLabels: {
      fontSize: 10,
    },
  };

  // Renderizar gráfico baseado no tipo
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart
            data={data}
            width={screenWidth - 64}
            height={height}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withVerticalLines={false}
            withHorizontalLines={false}
            withShadow={false}
          />
        );

      case "bar":
        return (
          <BarChart
            data={data}
            width={screenWidth - 64}
            height={height}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
            withCustomBarColorFromData
            flatColor
          />
        );

      case "pie":
        return (
          <PieChart
            data={data}
            width={screenWidth - 64}
            height={height}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        );

      default:
        return null;
    }
  };

  // Renderizar legenda para gráfico de pizza
  const renderPieLegend = () => {
    if (type !== "pie" || !showLegend) return null;

    return (
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: item.color }]}
            />
            <Text style={styles.legendText}>
              {item.name}: {item.population}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.chartContainer}>{renderChart()}</View>
      {renderPieLegend()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  chart: {
    borderRadius: 8,
  },
  legendContainer: {
    marginTop: 16,
    alignItems: "flex-start",
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
});

export default ProgressChart;
