from nicegui import ui
import pandas as pd
import numpy as np
import plotly.graph_objects as go



circuit_img = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_PoaEZoY5zqM1_1uBsH30J1ZDLCW93D0tUepqy879ITUJwXexlABbgwnnrh2_hmv8bxU&usqp=CAU"
ui.image(circuit_img).style("width: 500px;margin-left:20%")

# define the function to plot
def sigmoid(var, L, x0=0):
    return (0.6 - L) / (1 + np.e**(-3.7*(var - x0)))

def create_graph(x0= 0):
    # create the x-values for the plot
    x = [-5 + i * 0.1 for i in range(101)]

    steps1 = np.arange(-0.4, 0.7, 0.05)
    steps2 = np.arange(-2, 2, 0.2)

    fig = go.Figure()
    fig.update_layout(margin=dict(l=0, r=0, t=0, b=0))
    fig.add_trace(go.Line(x=x, y=[0.6 for i in range(len(x))], name="Voltaje de barrera sin V a bornes"))

    steps1 = np.arange(-0.4, 0.7, 0.05)
    for step in steps1:
        fig.add_trace(
            go.Scatter(
                visible=False,
                line=dict(color="#00CED1", width=6),
                name="V = " + str(np.round(step, 2)),
                x=x,
                y=[sigmoid(x[i], step, x0) for i in range(len(x))]
            ))
        fig.update_yaxes(range=[0, 1.2])

    # Make 10th trace visible
    fig.data[9].visible = True

    # Create and add slider
    steps = []
    for i in range(len(fig.data)):
        if i == 0:
            continue
        step = dict(
            method="update",
            args=[{"visible": [True] + [False] * (len(fig.data) - 1)}],
        )
        step["args"][0]["visible"][i] = True  # Toggle i'th trace to "visible"
        steps.append(step)

    sliders = [dict(
        active=8,
        currentvalue={"prefix": "Voltaje a bornes: "},
        pad={"t": 50},
        steps=steps,
        activebgcolor="red",
        bgcolor="blue"
    )]

    fig.update_layout(
        sliders=sliders
    )
    ui.plotly(fig).classes('w-270 h-100').style("margin-top: 30px; margin-left: 20%")


slider = ui.slider(min=-5, max=5, value=0, step=0.1).style("width: 330px; margin-left: 25%")

ui.label().bind_text_from(slider, "value").style("width: 330px; margin-left: 35%")
ui.label("Ratio P/N").style("width: 330px; margin-left: 33%")


ui.button("Crear grafico").on("click", lambda click : create_graph(slider.value)).style("width: 330px; margin-left: 25%")

ui.run(reload=False)