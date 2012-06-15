module Orgchartgem
  class ChartsController < ApplicationController
    include ChartsHelper

    layout "application"

    def build
      if true#user_signed_in?
        @chart = Chart.find params[:id]
        @data = chartNodes(@chart.id)
        @nodes = Node.all(:conditions => ["chart_id = ?", @chart.id])
        render :build
      else
        redirect_to '/'
      end
    end

    def nodeOnChart
      width = (params[:width]) ? params[:width] : ''

      if params[:node_id].empty?
        node = Node.new(
          :title => params[:title],
          :english => params[:english],
          :chinese => params[:chinese],
          :comment => params[:comment],
          :decoration => 'width:'+width +';background-color:'+ params[:background_color] +';border-color:'+ params[:border_color],
          :node_type => params[:node_type],
          :chart_id => params[:chart_id]
        )
        if params[:parents] && !params[:parents].empty?
          params[:parents].each do |parent_id|
            parent = Node.find parent_id
            node.parents << parent
            if parent.node_type == "pile"
              node.node_type = "pile-son"
            end
          end
        end
        node.save!
      else
        node = Node.find params[:node_id]
        node.title = params[:title]
        node.english = params[:english]
        node.chinese = params[:chinese]
        node.comment = params[:comment]
        node.node_type = params[:node_type]
        node.decoration = 'width:'+width +';background-color:'+ params[:background_color] +';border-color:'+ params[:border_color]

        if params[:parents] && !params[:parents].empty?

        	parentsIds = []
          node.parents.each do |parent|
          	parentsIds << parent.id.to_s
          end

          if parentsIds == params[:parents]
          elsif
            node.parents.clear
            params[:parents].each do |parent_id|
              parent = Node.find parent_id
              node.parents << parent
            end
          end
        end
        node.children.each do |child|
          child = Node.find child.id
          if params[:node_type] == "pile"
            child.node_type = "pile-son"
          elsif child.node_type != "pile"
            child.node_type = ""
          end
          child.save!
        end
        node.save!
      end

      render :json => chartNodes(params[:chart_id])
    end

    def deleteFromChart
      node = Node.find params[:node_id]
      if node.children.empty?
        Node.delete params[:node_id]
      end
      render :json => chartNodes(params[:chart_id])
    end

    def loadNode
      @node = Node.find(params[:node_id])
      render :json => @node.to_json
    end

    def loadNodes
      @nodes = Node.where(:chart_id => params[:chart_id])
      render :json => @nodes.to_json
    end

    # GET /charts
    # GET /charts.json
    def index
      @charts = Chart.all
      respond_to do |format|
        format.html # index.html.erb
        format.json { render json: @charts }
      end
    end

    # GET /charts/1
    # GET /charts/1.json
    def show
      @chart = Chart.find(params[:id])
      @data = chartNodes(@chart.id)

      respond_to do |format|
        format.html # show.html.erb
        format.json { render json: @chart }
      end
    end

    # GET /charts/new
    # GET /charts/new.json
    def new
      @chart = Chart.new

      respond_to do |format|
        format.html # new.html.erb
        format.json { render json: @chart }
      end
    end

    # GET /charts/1/edit
    def edit
      @chart = Chart.find(params[:id])
    end

    # POST /charts
    # POST /charts.json
    def create
      @chart = Chart.new(params[:chart])

      respond_to do |format|
        if @chart.save
          format.html { redirect_to orgchart.build_path(@chart) }
          format.json { render json: @chart, status: :created, location: @chart }
        else
          format.html { render action: "new" }
          format.json { render json: @chart.errors, status: :unprocessable_entity }
        end
      end
    end

    # PUT /charts/1
    # PUT /charts/1.json
    def update
      @chart = Chart.find(params[:id])

      respond_to do |format|
        if @chart.update_attributes(params[:chart])
          format.html { redirect_to @chart, notice: 'Chart was successfully updated.' }
          format.json { head :no_content }
        else
          format.html { render action: "edit" }
          format.json { render json: @chart.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /charts/1
    # DELETE /charts/1.json
    def destroy
      @chart = Chart.find(params[:id])
      @chart.destroy

      respond_to do |format|
        format.html { redirect_to orgchart.charts_path }
        format.json { head :no_content }
      end
    end
  end
end
